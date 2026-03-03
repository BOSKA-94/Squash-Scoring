# AGENTS.md

## Project Overview

This is a squash scoring app for ZeppOS (Zepp smartwatch platform), supporting multiple devices including GTR-4, Balance, Cheetah Pro, etc. The app tracks scores and games for two players using localStorage for persistence.

## Architecture

### ZeppOS Structure
This follows ZeppOS v3 app architecture (backwards compatible with v2):
- **app.js**: Entry point with lifecycle hooks (onCreate, onDestroy)
- **page/index.js**: Main UI page with all scoring logic and widget management
- **app-side/index.js**: Background service (minimal in this app - just i18n initialization)
- **app.json**: App manifest with configuration, permissions, targets, and i18n support
- **assets/**: Device-specific assets

### Key Technical Details
- Uses `@zos/ui` for widget creation and event handling
- Uses `@zos/storage` localStorage for persisting scores and games between sessions
- Layout is calculated dynamically based on device dimensions (responsive design)
- TypeScript type definitions from `@zeppos/device-types` package
- i18n support for en-US, ru-RU, pl-PL (using .po files in page/i18n/ and app-side/i18n/)

### UI Layout (page/index.js)
The screen is divided vertically into two halves:
- **Left side (player 1)**: Blue background (#2c79cc), red text (#fc6950)
  - Large button (0, 0, 233x466) - tap to increment score
  - Game counter text widget (67, 25) - tap to increment games
  - Decrement button (150, 400) - "-1" removes points/games
- **Right side (player 2)**: Red background (#fc6950), blue text (#2c79cc)  
  - Large button (234, 0, 233x466) - tap to increment score
  - Game counter text widget (300, 25) - tap to increment games
  - Decrement button (237, 400) - "-1" removes points/games
- **Center**: Reset button (193, 10) - clears all scores and games

### Scoring Logic
- Clicking large buttons increments that player's score
- When a score reaches 11, that player's game count increments and both scores reset to 0
- Decrement buttons reduce score by 1, or reduce games by 1 if score is already 0
- All state persists to localStorage with keys: scores1, scores2, games1, games2

## Development

### Prerequisites
- Node.js installed
- `@zeppos/device-types` package (already in devDependencies)

### Installation
```bash
npm install
```

### File Organization
When editing code:
- **UI changes**: Modify page/index.js
- **App lifecycle**: Modify app.js
- **Background logic**: Modify app-side/index.js
- **Configuration**: Modify app.json
- **Translations**: Add/edit .po files in page/i18n/ or app-side/i18n/

### Important Constraints
- Coordinates and sizes are calculated using `SCREEN_WIDTH` and `SCREEN_HEIGHT` to support multiple resolutions
- Widgets must be created using hmUI.createWidget() with specific types (BUTTON, TEXT, etc.)
- State management is entirely localStorage-based (no framework)
- No test framework is currently configured

## Supported Devices (updated Feb 2026)

The following round-screen ZeppOS devices are included in `app.json` (466x466 and 480x480 groups).

### 466x466 (round)

- Amazfit GTR 4 (`gtr4`) — deviceSource: 7930112 — 466x466
- Amazfit GTR 4 Global (`gtr4-global`) — deviceSource: 7930113 — 466x466
- GTR 4 variant (`gtr4-variant`) — deviceSource: 7864577 — 466x466
- Amazfit Active 2 Round (`active2-round`) — deviceSource: 8913152 — 466x466
- Active 2 Round Global (`active2-round-global`) — deviceSource: 8913153 — 466x466
- Active 2 Round Variant A (`active2-round-variant-a`) — deviceSource: 8913155 — 466x466
- Active 2 Round Variant B (`active2-round-variant-b`) — deviceSource: 8913159 — 466x466
- Active 2 Round v2 (`active2-round-v2`) — deviceSource: 10092800 — 466x466
- Active 2 Round v2 Global (`active2-round-v2-global`) — deviceSource: 10092801 — 466x466
- Active 2 Round v2 Variant A (`active2-round-v2-variant-a`) — deviceSource: 10092803 — 466x466
- Active 2 Round v2 Variant B (`active2-round-v2-variant-b`) — deviceSource: 10092807 — 466x466
- Amazfit T-Rex 3 Pro 44mm (`t-rex-3-pro-44`) — deviceSource: 10682624 — 466x466
- T-Rex 3 Pro 44mm Global (`t-rex-3-pro-44-global`) — deviceSource: 10682625 — 466x466
- T-Rex 3 Pro 44mm Variant (`t-rex-3-pro-44-variant`) — deviceSource: 10682627 — 466x466

### 480x480 (round)

- Amazfit Balance (`balance`) — deviceSource: 8519936 — 480x480
- Balance Global (`balance-global`) — deviceSource: 8519937 — 480x480
- Balance Variant (`balance-variant`) — deviceSource: 8519939 — 480x480
- Amazfit Cheetah Pro (`cheetah-pro`) — deviceSource: 8126720 — 480x480
- Cheetah Pro Global (`cheetah-pro-global`) — deviceSource: 8126721 — 480x480
- Amazfit T-Rex 3 (`t-rex-3`) — deviceSource: 8716544 — 480x480
- T-Rex 3 Global (`t-rex-3-global`) — deviceSource: 8716545 — 480x480
- T-Rex 3 Variant (`t-rex-3-variant`) — deviceSource: 8716547 — 480x480
- Balance 2 (`balance2`) — deviceSource: 9568512 — 480x480
- Balance 2 Global (`balance2-global`) — deviceSource: 9568513 — 480x480
- Balance 2 Variant (`balance2-variant`) — deviceSource: 9568515 — 480x480
- T-Rex 3 Pro 48mm (`t-rex-3-pro-48`) — deviceSource: 10551552 — 480x480
- T-Rex 3 Pro 48mm Global (`t-rex-3-pro-48-global`) — deviceSource: 10551553 — 480x480
- T-Rex 3 Pro 48mm Variant (`t-rex-3-pro-48-variant`) — deviceSource: 10551555 — 480x480
- Amazfit Active Max (`active-max`) — deviceSource: 10813697 — 480x480
- Active Max Global (`active-max-global`) — deviceSource: 10813699 — 480x480
