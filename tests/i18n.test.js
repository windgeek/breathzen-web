// Tests language choice and navigation without dependencies or network access.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/locales.json'), 'utf8'));
const script = fs.readFileSync(path.join(root, 'breathzen.js'), 'utf8');
function fixture({query = '', hash = '', saved = null, languages = ['en'], storageBlocked = false} = {}) {
  const values = new Set();
  function classes() { const set = new Set(); return {add: x => set.add(x), toggle: (x, value) => value ? set.add(x) : set.delete(x), contains: x => set.has(x)}; }
  const articles = Object.entries(content).map(([lang, t]) => ({lang, classList: classes(), dataset: {title: 'BreathZen — ' + t.support, heading: 'BreathZen', tagline: t.tagline, description: t.lead, language: t.language, footer: t.privacy}}));
  const nav = articles.map(a => ({dataset: {lang: a.lang}, attributes: {}, handlers: {}, setAttribute(k, v) {this.attributes[k] = v;}, removeAttribute(k) {delete this.attributes[k];}, addEventListener(k, v) {this.handlers[k] = v;}}));
  const links = articles.map(a => ({owner: a, href: 'privacy.html?lang=' + a.lang, getAttribute() {return this.href;}, setAttribute(k, v) {this.href = v;}, closest() {return this.owner;}}));
  const footer = {href: 'privacy.html?lang=en', getAttribute() {return this.href;}, setAttribute(k, v) {this.href = v;}, closest() {return null;}};
  const heading = {}, tagline = {}, meta = {}, navigation = {setAttribute(k,v) {this[k] = v;}};
  const document = {documentElement: {classList: classes()}, addEventListener(k, cb) {if (k === 'DOMContentLoaded') this.ready = cb;}, querySelector(sel) {
    if (sel.startsWith('article[lang=')) return articles.find(a => sel.includes('"' + a.lang + '"'));
    return {'header h1': heading, '.tagline': tagline, 'meta[name="description"]': meta, '.languages': navigation, '[data-footer-link]': footer}[sel];
  }, querySelectorAll(sel) {return {'article[lang]': articles, '.languages a': nav, '[data-local-link]': [...links, footer]}[sel];}};
  const url = new URL('https://windgeek.github.io/breathzen-web/' + query + hash);
  const location = {href: url.href, search: url.search, hash: url.hash};
  const context = {document, location, navigator: {languages}, URL, URLSearchParams,
    localStorage: {getItem() {if(storageBlocked) throw Error('blocked'); return saved;}, setItem(k,v) {if(storageBlocked) throw Error('blocked'); values.add(v);}},
    history: {replaceState(a,b,href) {const u = new URL(href); location.href = u.href; location.search = u.search; location.hash = u.hash;}},
    window: {addEventListener() {}}};
  vm.runInNewContext(script, context);
  document.ready();
  return {context, articles, nav, links, footer, values};
}
function expectLang(options, expected) {
  const f = fixture(options);
  assert.equal(f.context.document.documentElement.lang, expected);
  assert.deepEqual(f.articles.filter(a => a.classList.contains('active')).map(a => a.lang), [expected]);
  assert.equal(f.footer.href, 'privacy.html?lang=' + expected);
  assert.equal(f.context.document.title, 'BreathZen — ' + content[expected].support);
  return f;
}
for (const [input, expected] of Object.entries({'zh-TW':'zh-Hant','zh-HK':'zh-Hant','zh-MO':'zh-Hant','zh-Hant-TW':'zh-Hant','zh-Hans-HK':'zh-Hans','zh_CN':'zh-Hans','ja-JP':'ja','ko-KR':'ko','de-AT':'de','fr-CA':'fr','es-MX':'es','pt-PT':'pt-BR','pt-BR':'pt-BR','en-GB':'en'})) {
  expectLang({query: '?lang=' + input, saved:'de', languages:['fr']}, expected);
}
expectLang({saved:'zh-Hant', languages:['ja']}, 'zh-Hant');
expectLang({languages:['it-IT','ko-KR'], storageBlocked:true}, 'ko');
expectLang({query:'?lang=unknown', languages:['it-IT']}, 'en');
expectLang({hash:'#lang-ja', saved:'de'}, 'ja');
for (const lang of Object.keys(content)) {
  const f = expectLang({query:'?lang=en&source=store'}, 'en');
  let prevented = false;
  f.nav.find(n => n.dataset.lang === lang).handlers.click({preventDefault() {prevented = true;}});
  assert.ok(prevented);
  assert.equal(f.context.document.documentElement.lang, lang);
  assert.equal(new URL(f.context.location.href).searchParams.get('source'), 'store');
  assert.equal(new URL(f.context.location.href).searchParams.get('lang'), lang);
  assert.equal(f.footer.href, 'privacy.html?lang=' + lang);
  assert.ok(f.values.has(lang));
  assert.equal(f.nav.filter(n => n.attributes['aria-current'] === 'true').length, 1);
  assert.equal(f.links.find(l => l.owner.lang === lang).href, 'privacy.html?lang=' + lang);
}
const modified = fixture();
let intercepted = false;
modified.nav[1].handlers.click({metaKey:true, preventDefault() {intercepted = true;}});
assert.equal(intercepted, false);
console.log('Passed: locale variants, priority, unavailable storage, 9 language switches, titles, links and URL persistence.');
