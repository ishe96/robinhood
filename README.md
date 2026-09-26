# EtherSwap UI Update

Complete redesign of the Robinhood-inspired crypto trading UI.

## What's New

### New Components
| File | Description |
|------|-------------|
| `components/MarketTicker.js` | Animated scrolling price ticker — top 12 coins |
| `components/ChartPanel.js` | Line / Area / Candlestick chart with period selector (1H, 6H, 24H, 7D) |
| `components/CandlestickChart.js` | Custom SVG OHLC candlestick — no extra packages required |
| `components/SwapPanel.js` | Redesigned token swap UI (replaces BuyTokens.js) |
| `components/NewsSection.js` | Live crypto news via **CryptoCompare free API** (no key needed) |
| `components/WalletCard.js` | Wallet info + portfolio value card for the right panel |

### Updated Files
| File | Change |
|------|--------|
| `styles/globals.css` | Full design-system reset — fonts, CSS vars, utilities |
| `tailwind.config.js` | Custom `es-*` color tokens + Inter/JetBrains Mono |
| `components/Header.js` | Active search bar, cleaner nav, wallet status indicator |
| `components/Assets.js` | Sparklines shown, price formatting, coin icons, rank badges |
| `pages/index.js` | Two-column dashboard layout, `ohlcData` passed to chart, error handling in `getStaticProps` |

### Old Files (safe to keep, no longer imported)
- `components/LineChart.js` — replaced by `ChartPanel.js`
- `components/BuyTokens.js` — replaced by `SwapPanel.js`
- `components/Notice.js` — replaced by `NewsSection.js`
- `components/PortfolioChart.js` — already unused, still unused

---

## How to Apply

1. Copy all files from this folder into your project root (merge, don't replace the whole project).
2. Run `yarn` or `npm install` — no new packages needed!
3. Run `yarn dev`.

```bash
cp -r robinhood-ui-update/* robinhood/
cd robinhood && yarn dev
```

---

## Design System

| Token | Value | Use |
|-------|-------|-----|
| `--es-bg` | `#070b0f` | Page background |
| `--es-panel` | `#0e1825` | Secondary panels |
| `--es-card` | `#131f2e` | Card surfaces |
| `--es-hover` | `#182537` | Hover states / inputs |
| `--es-up` | `#12d992` | Positive / gains |
| `--es-down` | `#ff4560` | Negative / losses |
| `--es-blue` | `#4a9eff` | Informational / links |
| `--es-text` | `#e8f0fe` | Primary text |
| `--es-sub` | `#8090b0` | Secondary text |
| `--es-muted` | `#3a4e6e` | Tertiary / labels |
| `--es-border` | `#1a2840` | Borders / dividers |

Fonts loaded via Google Fonts (globals.css):
- **Inter** — UI text
- **JetBrains Mono** — all financial numbers

---

## Smart Contracts & Studio

The `smart_contracts/` and `studio/` folders are untouched — this update only modifies the frontend UI layer. All blockchain context (`context/RobinhoodContext.js`), ABIs (`lib/`), and API routes (`pages/api/`) are preserved exactly as they were.

---

## News API

The news section calls `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&limit=6` client-side — completely free, no API key required.

---

## Candlestick Chart

The OHLC chart uses your existing CoinRanking endpoint (`/coin/razxDUgYGNAdQ/ohlc`) and renders via custom SVG — no new npm packages. `getStaticProps` now passes the full `ohlcData` array (up to 30 candles) so the chart has data to display. Hover any candle for O/C/H/L tooltip.
