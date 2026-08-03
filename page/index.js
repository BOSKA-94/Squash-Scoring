import * as hmUI from '@zos/ui'
import { localStorage } from '@zos/storage'
import { getDeviceInfo } from '@zos/device'
import { getText } from '@zos/i18n'

// ---------------------------------------------------------------------------
// Device geometry
// ---------------------------------------------------------------------------
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = getDeviceInfo()

// Every coordinate, size and font size is expressed as a fraction of the
// screen so one layout serves both the 466x466 and 480x480 target groups.
const rw = (ratio) => Math.floor(SCREEN_WIDTH * ratio)
const rh = (ratio) => Math.floor(SCREEN_HEIGHT * ratio)

const HALF_WIDTH = Math.floor(SCREEN_WIDTH / 2)
const RIGHT_X = HALF_WIDTH
const RIGHT_WIDTH = SCREEN_WIDTH - RIGHT_X

// ---------------------------------------------------------------------------
// Scoring rules (PAR-11)
// ---------------------------------------------------------------------------
const WINNING_SCORE = 11
const DEUCE_SCORE = WINNING_SCORE - 1 // once both sides reach 10, win by two
const WIN_BY = 2

// Player indices. PLAYER_1 owns the left half, PLAYER_2 the right half.
const PLAYER_1 = 0
const PLAYER_2 = 1
const PLAYERS = [PLAYER_1, PLAYER_2]
const opponentOf = (player) => 1 - player

// A game is won by reaching 11, except that once the opponent has also reached
// 10 the winner must lead by two points. Note the bare `true` on the second
// line: an earlier `=== WINNING_SCORE` check made scores such as 12-9
// unwinnable, which left the app stuck with no way to finish the game.
const isGameWon = (mine, theirs) => {
  if (mine < WINNING_SCORE) return false
  if (theirs < DEUCE_SCORE) return true
  return mine - theirs >= WIN_BY
}

// Deuce: both players have reached 10, so the game is now decided by a
// two-point lead rather than by whoever reaches 11 first.
const isDeuce = (mine, theirs) => mine >= DEUCE_SCORE && theirs >= DEUCE_SCORE

// Advantage: at deuce and leading by exactly one point, so the next rally
// either takes the game or drops back to deuce.
const hasAdvantage = (mine, theirs) => isDeuce(mine, theirs) && mine - theirs === 1

// What the scoreboard actually shows. Past deuce the display freezes at 10-10
// and the advantage dot carries the difference instead, the way a tennis
// scoreboard shows deuce and advantage rather than counting upwards. The
// internal score keeps incrementing so the two-point lead stays detectable.
// Because a two-point lead settles the game immediately, the displayed score
// never exceeds 10.
const displayScore = (mine, theirs) => (isDeuce(mine, theirs) ? DEUCE_SCORE : mine)

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------
// Key names are kept from earlier versions so saved matches survive upgrades.
const STORAGE_KEYS = {
  scores: ['scores1', 'scores2'],
  games: ['games1', 'games2']
}

const readCounter = (key) => {
  const stored = parseInt(localStorage.getItem(key) || '0')
  return isNaN(stored) ? 0 : stored
}

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------
const COLORS = {
  player1Bg: 0x2c79cc,
  player1Text: 0xfc6950,
  player1Press: 0x89b4f4,
  player2Bg: 0xfc6950,
  player2Text: 0x2c79cc,
  player2Press: 0xfeb4a8,
  bluePress: 0x5895f0, // deeper blue used by the right "-1" button
  white: 0xffffff,
  resetPress: 0xfd1302
}

// Each half is painted in that player's colour and lettered in the other's.
const HALF_THEME = [
  { bg: COLORS.player1Bg, press: COLORS.player1Press, text: COLORS.player1Text },
  { bg: COLORS.player2Bg, press: COLORS.player2Press, text: COLORS.player2Text }
]

// The "-1" buttons sit on their own half's background, so they invert it.
const MINUS_THEME = [
  { bg: COLORS.player2Bg, press: COLORS.player2Press },
  { bg: COLORS.player1Bg, press: COLORS.bluePress }
]

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
const SCORE_TEXT_SIZE = rw(0.258)

// Games counters sit near the top of each half, inset from the half's edge.
const GAMES_COUNTER = {
  inset: rw(0.144),
  y: rh(0.054),
  w: rw(0.215),
  h: rh(0.129),
  textSize: rw(0.107)
}

// The two "-1" buttons flank the centre line along the bottom.
const MINUS_BUTTON = {
  x: [rw(0.322), rw(0.509)],
  y: rh(0.858),
  w: rw(0.172),
  h: rh(0.118),
  radius: rw(0.043),
  textSize: rw(0.086)
}

const RESET_BUTTON = {
  x: rw(0.414),
  y: rh(0.021),
  w: rw(0.172),
  h: rh(0.118),
  radius: rw(0.043),
  textSize: rw(0.054)
}

// Advantage dots sit just inside the centre dividing line, vertically centred,
// so the pair reads together in the middle of the screen while each dot stays
// on its own player's side of the line. The inset clears the score glyphs,
// which are never more than two digits wide because the display freezes at 10.
const ADVANTAGE_DOT = {
  centerInset: rw(0.047),
  radius: rw(0.024),
  y: Math.floor(SCREEN_HEIGHT / 2)
}
const DOT_CENTER_X = [
  HALF_WIDTH - ADVANTAGE_DOT.centerInset,
  HALF_WIDTH + ADVANTAGE_DOT.centerInset
]

// CIRCLE visibility is driven by alpha: 0 is fully transparent.
const ALPHA_HIDDEN = 0
const ALPHA_VISIBLE = 255

Page({
  build() {
    // ----------------------------------------------------------------
    // State: one entry per player, restored from the previous session.
    // ----------------------------------------------------------------
    const scores = STORAGE_KEYS.scores.map(readCounter)
    const games = STORAGE_KEYS.games.map(readCounter)

    // Widget handles, populated further down. render() depends on all three
    // arrays being filled, so it must not run until build() has created them.
    const scoreWidgets = []
    const gamesWidgets = []
    const dotWidgets = []

    const persist = () => {
      PLAYERS.forEach((player) => {
        localStorage.setItem(STORAGE_KEYS.scores[player], String(scores[player]))
        localStorage.setItem(STORAGE_KEYS.games[player], String(games[player]))
      })
    }

    // ----------------------------------------------------------------
    // Rendering: every widget is refreshed from state, never in place.
    // ----------------------------------------------------------------
    const halfGeometry = (player) =>
      player === PLAYER_1
        ? { x: 0, w: HALF_WIDTH }
        : { x: RIGHT_X, w: RIGHT_WIDTH }

    const scoreLabel = (player) =>
      String(displayScore(scores[player], scores[opponentOf(player)]))

    // A BUTTON needs its full geometry replayed alongside the new text,
    // otherwise it collapses towards the top-left corner.
    const renderScore = (player) => {
      const { x, w } = halfGeometry(player)
      scoreWidgets[player].setProperty(hmUI.prop.MORE, {
        x,
        y: 0,
        w,
        h: SCREEN_HEIGHT,
        text: scoreLabel(player)
      })
    }

    const renderGames = (player) => {
      gamesWidgets[player].setProperty(hmUI.prop.MORE, {
        text: String(games[player])
      })
    }

    const renderDot = (player) => {
      const showing = hasAdvantage(scores[player], scores[opponentOf(player)])
      dotWidgets[player].setProperty(hmUI.prop.MORE, {
        center_x: DOT_CENTER_X[player],
        center_y: ADVANTAGE_DOT.y,
        radius: ADVANTAGE_DOT.radius,
        color: COLORS.white,
        alpha: showing ? ALPHA_VISIBLE : ALPHA_HIDDEN
      })
    }

    const render = () => {
      PLAYERS.forEach((player) => {
        renderScore(player)
        renderGames(player)
        renderDot(player)
      })
    }

    // Credit a decided game and clear the scoreboard for the next one. This
    // runs after every score change, decrements included, so the app can
    // never rest on an already-won score such as 11-9.
    const settleGame = () => {
      PLAYERS.forEach((player) => {
        if (isGameWon(scores[player], scores[opponentOf(player)])) {
          games[player]++
          scores[PLAYER_1] = 0
          scores[PLAYER_2] = 0
        }
      })
    }

    const commit = () => {
      settleGame()
      persist()
      render()
    }

    // ----------------------------------------------------------------
    // Actions
    // ----------------------------------------------------------------
    const addPoint = (player) => {
      scores[player]++
      commit()
    }

    const removePoint = (player) => {
      // With no points left to take back, step back through the games won.
      if (scores[player] === 0) {
        if (games[player] > 0) games[player]--
      } else {
        scores[player]--
      }
      commit()
    }

    // Manual override for a game the app did not score itself.
    const addGame = (player) => {
      games[player]++
      persist()
      render()
    }

    const resetAll = () => {
      PLAYERS.forEach((player) => {
        scores[player] = 0
        games[player] = 0
      })
      persist()
      render()
    }

    // ----------------------------------------------------------------
    // Widgets: each half's score button doubles as its background.
    // ----------------------------------------------------------------
    PLAYERS.forEach((player) => {
      const { x, w } = halfGeometry(player)
      const theme = HALF_THEME[player]

      scoreWidgets[player] = hmUI.createWidget(hmUI.widget.BUTTON, {
        x,
        y: 0,
        w,
        h: SCREEN_HEIGHT,
        normal_color: theme.bg,
        press_color: theme.press,
        text: scoreLabel(player),
        text_size: SCORE_TEXT_SIZE,
        color: theme.text,
        click_func: () => addPoint(player)
      })
    })

    PLAYERS.forEach((player) => {
      const { x } = halfGeometry(player)

      gamesWidgets[player] = hmUI.createWidget(hmUI.widget.TEXT, {
        x: x + GAMES_COUNTER.inset,
        y: GAMES_COUNTER.y,
        w: GAMES_COUNTER.w,
        h: GAMES_COUNTER.h,
        color: COLORS.white,
        text_size: GAMES_COUNTER.textSize,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: String(games[player])
      })

      gamesWidgets[player].addEventListener(hmUI.event.CLICK_DOWN, () => {
        addGame(player)
      })
    })

    PLAYERS.forEach((player) => {
      hmUI.createWidget(hmUI.widget.BUTTON, {
        x: MINUS_BUTTON.x[player],
        y: MINUS_BUTTON.y,
        w: MINUS_BUTTON.w,
        h: MINUS_BUTTON.h,
        normal_color: MINUS_THEME[player].bg,
        press_color: MINUS_THEME[player].press,
        text: '-1',
        text_size: MINUS_BUTTON.textSize,
        color: COLORS.white,
        radius: MINUS_BUTTON.radius,
        click_func: () => removePoint(player)
      })
    })

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: RESET_BUTTON.x,
      y: RESET_BUTTON.y,
      w: RESET_BUTTON.w,
      h: RESET_BUTTON.h,
      normal_color: COLORS.white,
      press_color: COLORS.resetPress,
      // Fall back to a literal so a missing translation can never leave this
      // button blank, which is how it looked when the i18n lookup failed.
      text: getText('reset') || 'Reset',
      text_size: RESET_BUTTON.textSize,
      color: COLORS.player1Bg,
      radius: RESET_BUTTON.radius,
      click_func: () => resetAll()
    })

    // Created last so the dots paint above the full-height score buttons.
    PLAYERS.forEach((player) => {
      dotWidgets[player] = hmUI.createWidget(hmUI.widget.CIRCLE, {
        center_x: DOT_CENTER_X[player],
        center_y: ADVANTAGE_DOT.y,
        radius: ADVANTAGE_DOT.radius,
        color: COLORS.white,
        alpha: ALPHA_HIDDEN
      })
    })

    // Draw the restored state. commit() rather than render() so a scoreboard
    // left in an already-won position by an older build is settled on launch.
    commit()
  }
})
