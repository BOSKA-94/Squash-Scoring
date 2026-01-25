# AGENTS.md

## Project Overview

This is a squash scoring app for ZeppOS (Zepp smartwatch platform), supporting multiple devices including GTR-4, Balance, Cheetah Pro. The app tracks scores and games for two players using localStorage for persistence.

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
