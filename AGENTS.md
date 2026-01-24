# AGENTS.md

## Project Overview

This is a squash scoring app for ZeppOS (Zepp smartwatch platform), targeting GTR-4 devices with 466x466 resolution. The app tracks scores and games for two players using localStorage for persistence.

## Architecture

### ZeppOS Structure
This follows ZeppOS v2 app architecture:
- **app.js**: Entry point with lifecycle hooks (onCreate, onDestroy)
- **page/index.js**: Main UI page with all scoring logic and widget management
- **app-side/index.js**: Background service (minimal in this app - just i18n initialization)
- **app.json**: App manifest with configuration, permissions, targets, and i18n support
- **assets/**: Device-specific assets organized by resolution (466x466-gtr-4/)

### Key Technical Details
- Uses `@zos/ui` for widget creation and event handling
- Uses `@zos/storage` localStorage for persisting scores and games between sessions
- Layout is hardcoded for 466x466 resolution (GTR-4 watch)
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
- All coordinates and sizes are fixed for 466x466 resolution
- Widgets must be created using hmUI.createWidget() with specific types (BUTTON, TEXT, etc.)
- State management is entirely localStorage-based (no framework)
- No test framework is currently configured
