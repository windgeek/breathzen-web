# BreathZen — support and privacy pages

Static, dependency-free pages prepared for GitHub Pages and App Store Connect.

| Page | File | App Store Connect field |
|---|---|---|
| Support | `index.html` | Support URL |
| Privacy Policy | `privacy.html` | Privacy Policy URL |

Both English and Simplified Chinese live in each HTML file. Language selection
uses `?lang=` first, then the last selection, then the browser language, with
English as the fallback.

## Publication

This folder is published from the public `windgeek/breathzen-web` repository,
mirroring the existing `shotzen-web` setup. GitHub Pages deploys from the
`main` branch and repository root:

- `https://windgeek.github.io/breathzen-web/`
- `https://windgeek.github.io/breathzen-web/privacy.html`

Both URLs were verified publicly on August 11, 2026. They are the preferred
Support URL and Privacy Policy URL for App Store Connect. The old Notion page
may remain online as a harmless legacy link, but is no longer the canonical
policy.

## Accuracy notes

The policy intentionally says that everyday practice works offline, not that
the app never connects to the network. StoreKit contacts Apple when the user
opens purchase features, buys, or restores. Optional Apple Health integration
is write-only. BreathZen does not request microphone access.
