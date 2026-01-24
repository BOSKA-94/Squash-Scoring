import * as hmUI from '@zos/ui'
import { localStorage } from '@zos/storage'

// Constants
const SCREEN_WIDTH = 466
const HALF_WIDTH = 233
const WINNING_SCORE = 11
const COLORS = {
  player1Bg: 0x2c79cc,
  player1Text: 0xfc6950,
  player1Press: 0x89b4f4,
  player2Bg: 0xfc6950,
  player2Text: 0x2c79cc,
  player2Press: 0xfeb4a8,
  white: 0xffffff,
  resetPress: 0xFD1302
}

Page({
  build() {
    let scores1 = parseInt(localStorage.getItem('scores1') || '0')
    let scores2 = parseInt(localStorage.getItem('scores2') || '0')
    let games1 = parseInt(localStorage.getItem('games1') || '0')
    let games2 = parseInt(localStorage.getItem('games2') || '0')

    // Helper function to update widget text
    const updateWidget = (widget, text, x = null) => {
      const props = { text }
      if (x !== null) {
        props.x = x
        props.y = 0
        props.w = HALF_WIDTH
        props.h = SCREEN_WIDTH
      }
      widget.setProperty(hmUI.prop.MORE, props)
    }

    // Left widget with scores
    const scoresWidget1 = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 0,
      y: 0,
      w: HALF_WIDTH,
      h: SCREEN_WIDTH,
      normal_color: COLORS.player1Bg,
      press_color: COLORS.player1Press,
      text: scores1,
      text_size: 120,
      color: COLORS.player1Text,
      click_func: (button_widget) => {
        scores1++
        localStorage.setItem('scores1', scores1)
        if (scores1 === WINNING_SCORE) {
          games1++
          localStorage.setItem('games1', games1)
          scores1 = 0
          scores2 = 0
          localStorage.setItem('scores1', scores1)
          localStorage.setItem('scores2', scores2)
          updateWidget(gamesWidget1, games1)
        }

        updateWidget(button_widget, scores1, 0)
        updateWidget(scoresWidget2, scores2, HALF_WIDTH + 1)
      }
    })

    // Right widget with scores
    const scoresWidget2 = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: HALF_WIDTH + 1,
      y: 0,
      w: HALF_WIDTH,
      h: SCREEN_WIDTH,
      normal_color: COLORS.player2Bg,
      press_color: COLORS.player2Press,
      text: scores2,
      text_size: 120,
      color: COLORS.player2Text,
      click_func: (button_widget) => {
        scores2++
        localStorage.setItem('scores2', scores2)
        if (scores2 === WINNING_SCORE) {
          games2++
          localStorage.setItem('games2', games2)
          scores1 = 0
          scores2 = 0
          localStorage.setItem('scores1', scores1)
          localStorage.setItem('scores2', scores2)
          updateWidget(gamesWidget2, games2)
        }

        updateWidget(button_widget, scores2, HALF_WIDTH + 1)
        updateWidget(scoresWidget1, scores1, 0)
      }
    })

    // Left widget with total games
    const gamesWidget1 = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 67,
      y: 25,
      w: 100,
      h: 60,
      color: COLORS.white,
      text_size: 50,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: games1
    })

    // Count +1 when click to the total games button
    gamesWidget1.addEventListener(hmUI.event.CLICK_DOWN, (info) => {
      games1++
      localStorage.setItem('games1', games1)
      updateWidget(gamesWidget1, games1)
    })

    // Right widget with total games
    const gamesWidget2 = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 300,
      y: 25,
      w: 100,
      h: 60,
      color: COLORS.white,
      text_size: 50,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: games2
    })

    // Count +1 when click to the total games button
    gamesWidget2.addEventListener(hmUI.event.CLICK_DOWN, (info) => {
      games2++
      localStorage.setItem('games2', games2)
      updateWidget(gamesWidget2, games2)
    })

    // Left button to -1 of scores
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 150,
      y: 400,
      w: 80,
      h: 55,
      normal_color: COLORS.player2Bg,
      press_color: COLORS.player2Press,
      text: '-1',
      text_size: 40,
      color: COLORS.white,
      radius: 20,
      click_func: (button_widget) => {
        if (scores1 === 0 && games1 > 0) {
          games1--
          localStorage.setItem('games1', games1)
          updateWidget(gamesWidget1, games1)
        }

        if (scores1 > 0) {
          scores1--
          localStorage.setItem('scores1', scores1)
          updateWidget(scoresWidget1, scores1, 0)
        }
      }
    })

    // Right button to -1 of scores
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 237,
      y: 400,
      w: 80,
      h: 55,
      normal_color: COLORS.player1Bg,
      press_color: 0x5895f0,
      text: '-1',
      text_size: 40,
      color: COLORS.white,
      radius: 20,
      click_func: (button_widget) => {
        if (scores2 === 0 && games2 > 0) {
          games2--
          localStorage.setItem('games2', games2)
          updateWidget(gamesWidget2, games2)
        }

        if (scores2 > 0) {
          scores2--
          localStorage.setItem('scores2', scores2)
          updateWidget(scoresWidget2, scores2, HALF_WIDTH + 1)
        }
      }
    })

    // Reset button
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 193,
      y: 10,
      w: 80,
      h: 55,
      normal_color: COLORS.white,
      press_color: COLORS.resetPress,
      text: 'Reset',
      text_size: 25,
      color: COLORS.player1Bg,
      radius: 20,
      click_func: (button_widget) => {
        scores1 = 0
        scores2 = 0
        games1 = 0
        games2 = 0
        
        localStorage.setItem('scores1', scores1)
        localStorage.setItem('scores2', scores2)
        localStorage.setItem('games1', games1)
        localStorage.setItem('games2', games2)
        
        updateWidget(scoresWidget1, scores1, 0)
        updateWidget(scoresWidget2, scores2, HALF_WIDTH + 1)
        updateWidget(gamesWidget1, games1)
        updateWidget(gamesWidget2, games2)
      }
    })
  }
})