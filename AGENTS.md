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
- i18n support for en-US, ru-RU, pl-PL. Page strings live in `page/i18n/*.po` and are read via `gettext`; `app-side/i18n/` only has the en-US scaffold, since the app-side module has no user-facing strings.

### Code structure (page/index.js)
The page is organised as state → render, not as two mirrored player blocks. When changing behaviour, prefer extending these pieces over adding per-player branches:
- **Module scope**: `rw()` / `rh()` ratio helpers, the `isGameWon` and `hasAdvantage` pure predicates, `COLORS`, and named layout constant groups (`GAMES_COUNTER`, `MINUS_BUTTON`, `RESET_BUTTON`, `ADVANTAGE_DOT`).
- **State**: `scores` and `games` are two-element arrays indexed by `PLAYER_1` (0, left half) and `PLAYER_2` (1, right half). `opponentOf(player)` flips the index.
- **`render()`**: rebuilds every widget from state. Individual handlers must never poke a single widget directly.
- **`settleGame()`**: credits a decided game and clears both scores.
- **`commit()`**: `settleGame()` → `persist()` → `render()`. Every score mutation ends with exactly one `commit()` call, which is what keeps the win condition and the advantage dots consistent no matter which control was tapped.

### UI Layout (page/index.js)
All geometry is derived from `SCREEN_WIDTH` / `SCREEN_HEIGHT` via `rw()` / `rh()`; there are no absolute pixel coordinates, including font sizes. The screen is split vertically into two halves:
- **Left half (player 1)**: blue background (#2c79cc), red score text (#fc6950)
- **Right half (player 2)**: red background (#fc6950), blue score text (#2c79cc)
- Each half is a full-height BUTTON that doubles as the background — tap it to add a point
- Each half has a games counter near the top; tapping it adds a game manually
- Two "-1" buttons flank the centre line along the bottom, themed in the opposite half's colour
- A Reset button sits top-centre and clears all scores and games
- An advantage dot (`hmUI.widget.CIRCLE`, white) sits vertically centred at the outer edge of each half, created last so it paints above the score buttons

### Scoring Logic (PAR-11)
- Tapping a half increments that player's score
- A game is won at 11, except that once **both** players reach 10 the winner must lead by two (`WIN_BY`). So 11–9 wins, 11–10 does not, 12–10 does
- On a decided game the winner's games counter increments and both scores reset to 0
- The win condition is re-evaluated after **every** score change, decrements included, so the board can never rest on an already-won score such as 11–9
- **Advantage**: when both players are at 10+ and one leads by exactly one point, a white dot appears on that player's half. At 10–10 (or any tie) neither dot shows. Only one dot can ever be lit
- `-1` reduces the score by 1, or reduces games by 1 when the score is already 0
- All state persists to localStorage with keys: scores1, scores2, games1, games2. `commit()` on launch settles any already-won board left behind by an older build

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
- Coordinates, sizes and font sizes are calculated from `SCREEN_WIDTH` / `SCREEN_HEIGHT` through `rw()` / `rh()` to support both resolution groups. Do not introduce absolute pixel values
- Widgets must be created using hmUI.createWidget() with specific types (BUTTON, TEXT, CIRCLE, etc.)
- Updating a BUTTON's text via `setProperty(hmUI.prop.MORE, …)` requires replaying its full `x/y/w/h` geometry, otherwise the widget collapses toward the top-left corner
- CIRCLE widgets are shown and hidden through their `alpha` property (0 is fully transparent), not `VISIBLE`, which is not in the CIRCLE property access list
- State management is entirely localStorage-based (no framework)
- No test framework is currently configured, and the `zeus` CLI is not assumed to be installed. Scoring changes can still be checked by extracting the pure `isGameWon` / `hasAdvantage` predicates and asserting against them in plain Node
- Anything touching the dots must be verified in the simulator or on-device: the dots are drawn over the tappable score buttons, and glyph widths are font-dependent, so clearance from two-digit scores cannot be confirmed statically

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
