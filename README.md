# BreathZen — support and privacy pages

Static, dependency-free pages prepared for GitHub Pages and App Store Connect.

| Page | File | App Store Connect field |
|---|---|---|
| Support | `index.html` | Support URL |
| Privacy Policy | `privacy.html` | Privacy Policy URL |

Both English and Simplified Chinese live in each HTML file. Language selection
uses `?lang=` first, then the last selection, then the browser language, with
English as the fallback.

## Recommended publication

Keep this folder in its own public repository named `breathzen-web`, mirroring
the existing `shotzen-web` setup. Enable GitHub Pages from the `main` branch and
repository root. For the GitHub account `windgeek`, the resulting URLs should be:

- `https://windgeek.github.io/breathzen-web/`
- `https://windgeek.github.io/breathzen-web/privacy.html`

Open both URLs in a private browser window before entering them in App Store
Connect. Keep the existing Notion privacy URL active until the GitHub Pages URLs
are live.

## Accuracy notes

The policy intentionally says that everyday practice works offline, not that
the app never connects to the network. StoreKit contacts Apple when the user
opens purchase features, buys, or restores. Optional Apple Health integration
is write-only. BreathZen does not request microphone access.

