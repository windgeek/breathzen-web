(function () {
  "use strict";
  var LANGS = ["en", "zh-Hans", "zh-Hant", "ja", "ko", "de", "fr", "es", "pt-BR"];

  function normalise(tag) {
    if (typeof tag !== "string") return null;
    var parts = tag.toLowerCase().replace(/_/g, "-").split("-");
    var base = parts[0];
    if (base === "zh") {
      if (parts.indexOf("hant") >= 0) return "zh-Hant";
      if (parts.indexOf("hans") >= 0) return "zh-Hans";
      return parts.some(function (part) { return ["tw", "hk", "mo"].indexOf(part) >= 0; }) ? "zh-Hant" : "zh-Hans";
    }
    if (base === "pt") return "pt-BR";
    return LANGS.indexOf(base) >= 0 ? base : null;
  }

  function preferred() {
    var query = normalise(new URLSearchParams(location.search).get("lang"));
    if (query) return query;
    var hash = location.hash.replace(/^#lang-/, "");
    if (location.hash.indexOf("#lang-") === 0 && LANGS.indexOf(hash) >= 0) return hash;
    try {
      var saved = normalise(localStorage.getItem("breathzen.lang"));
      if (saved) return saved;
    } catch (error) { /* Storage may be unavailable. */ }
    var list = navigator.languages || [navigator.language];
    for (var i = 0; i < list.length; i += 1) {
      var match = normalise(list[i]);
      if (match) return match;
    }
    return "en";
  }

  function show(lang, updateURL) {
    if (LANGS.indexOf(lang) < 0) return;
    var active = document.querySelector('article[lang="' + lang + '"]');
    if (!active) return;
    document.querySelectorAll("article[lang]").forEach(function (article) {
      article.classList.toggle("active", article === active);
    });
    document.querySelectorAll(".languages a").forEach(function (link) {
      if (link.dataset.lang === lang) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    document.documentElement.lang = lang;
    document.documentElement.classList.add("localized");
    document.title = active.dataset.title;
    document.querySelector("header h1").textContent = active.dataset.heading;
    document.querySelector(".tagline").textContent = active.dataset.tagline;
    document.querySelector('meta[name="description"]').content = active.dataset.description;
    document.querySelector(".languages").setAttribute("aria-label", active.dataset.language);
    document.querySelector("[data-footer-link]").textContent = active.dataset.footer;
    document.querySelectorAll("[data-local-link]").forEach(function (link) {
      var url = new URL(link.getAttribute("href"), location.href);
      url.searchParams.set("lang", link.closest("article") ? link.closest("article").lang : lang);
      link.setAttribute("href", url.pathname.split("/").pop() + url.search);
    });
    try { localStorage.setItem("breathzen.lang", lang); } catch (error) {}
    if (updateURL) {
      var url = new URL(location.href);
      url.searchParams.set("lang", lang);
      if (url.hash.indexOf("#lang-") === 0) url.hash = "";
      try { history.replaceState(null, "", url.href); } catch (error) {}
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".languages a").forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        show(link.dataset.lang, true);
      });
    });
    window.addEventListener("popstate", function () { show(preferred(), false); });
    window.addEventListener("hashchange", function () {
      var lang = location.hash.replace(/^#lang-/, "");
      if (LANGS.indexOf(lang) >= 0) show(lang, true);
    });
    show(preferred(), false);
  });
})();
