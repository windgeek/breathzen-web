# BreathZen — support and privacy pages

Static, dependency-free support and privacy pages for iPhone, iPad, and Mac.

## Live pages

GitHub Pages publishes the root of `main` in `windgeek/breathzen-web`:

- Support: https://windgeek.github.io/breathzen-web/
- Privacy: https://windgeek.github.io/breathzen-web/privacy.html

Existing App Store Connect URLs remain valid. No app build is needed to update
these pages. The old Notion policy is not the canonical policy.

## Languages

Both pages include the complete content in English (`en`), Simplified Chinese
(`zh-Hans`), Traditional Chinese (`zh-Hant`), Japanese (`ja`), Korean (`ko`),
German (`de`), French (`fr`), Spanish (`es`), and Brazilian Portuguese (`pt-BR`).

Selection priority: supported `?lang=`, explicit language anchor, saved choice,
first supported browser language, then English. For example:

- `/?lang=ja`
- `/privacy.html?lang=zh-Hant`

Chinese script and region variants are distinguished; `zh-TW`, `zh-HK`, and
`zh-MO` select Traditional Chinese. Portuguese variants select the available
Brazilian translation. Explicit script tags take priority over region tags.
Switching languages updates the URL and remembers the selection when browser
storage is available. Links between pages preserve the language even when
storage is blocked. Without JavaScript, all translations remain readable and
the language links jump to the selected article.

## Editing and checking

Edit the reviewed source in `content/locales.json`, then regenerate both HTML
files. `content/mark.svg` retains the original site artwork. Commit generated
HTML together with source; GitHub Pages does not need a build dependency.

```sh
python3 scripts/build.py
node tests/i18n.test.js
python3 -m http.server 8765
```

Verify both pages at desktop and phone widths, including German and French
headings, Chinese script variants, page links, and unavailable browser storage.
All content is bundled: there are no remote translation APIs, fonts, analytics,
or tracking scripts.

## Content accuracy

Everyday practice works offline; purchase features and restoration may contact
Apple via StoreKit. Apple Health is optional and write-only on supported
devices and unavailable on Mac. Microphone access is never requested.

The policy retains its August 10, 2026 effective date. The October 5, 2026 note
identifies translation and platform clarifications, with no change to the
app's data practices. Mac uninstallation is not presented as a guarantee that
local data is deleted. Support instructions include the current Settings
restore entry and distinguish mobile Lock Screen controls from Mac sleep.
