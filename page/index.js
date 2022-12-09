import * as hmUI from '@zos/ui'

Page({
  build() {
    let scores1 = 0
    let scores2 = 0
    let games1 = 0
    let games2 = 0

    // Left widget with scores
    const scoresWidget1 = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 0,
      y: 0,
      w: (466 - 233),
      h: 466,
      normal_color: 0x2c79cc,
      press_color: 0x89b4f4,
      text: scores1,
      text_size: 120,
      color: 0xfc6950,
      click_func: (button_widget) => {
        scores1++
        if (scores1 == 11) {
          games1++
          scores1 = 0
          scores2 = 0
          gamesWidget1.setProperty(hmUI.prop.MORE, {
            text: games1
          })
        }

        button_widget.setProperty(hmUI.prop.MORE, {
          x: 0,
          y: 0,
          w: (466 - 233),
          h: 466,
          text: scores1
        })

        scoresWidget2.setProperty(hmUI.prop.MORE, {
          x: 234,
          y: 0,
          w: (466 - 233),
          h: 466,
          text: scores2
        })
      }
    })

    // Right widget with scores
    const scoresWidget2 = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 234,
      y: 0,
      w: (466 - 233),
      h: 466,
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: scores2,
      text_size: 120,
      color: 0x2c79cc,
      click_func: (button_widget) => {
        scores2++
        if (scores2 == 11) {
          games2++
          scores1 = 0
          scores2 = 0
          gamesWidget2.setProperty(hmUI.prop.MORE, {
            text: games2
          })
        }

        button_widget.setProperty(hmUI.prop.MORE, {
          x: 234,
          y: 0,
          w: (466 - 233),
          h: 466,
          text: scores2
        })

        scoresWidget1.setProperty(hmUI.prop.MORE, {
          x: 0,
          y: 0,
          w: (466 - 233),
          h: 466,
          text: scores1
        })
      }
    })

    // Left widget with total games
    const gamesWidget1 = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 67,
      y: 25,
      w: 100,
      h: 60,
      color: 0xffffff,
      text_size: 50,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: games1
    })

    // Count +1 when click to the total games button
    gamesWidget1.addEventListener(hmUI.event.CLICK_DOWN, (info) => {
      games1++
      gamesWidget1.setProperty(hmUI.prop.MORE, {
        text: games1
      })
    })

    // Right widget with total games
    const gamesWidget2 = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 300,
      y: 25,
      w: 100,
      h: 60,
      color: 0xffffff,
      text_size: 50,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: games2
    })

    // Count +1 when click to the total games button
    gamesWidget2.addEventListener(hmUI.event.CLICK_DOWN, (info) => {
      games2++
      gamesWidget2.setProperty(hmUI.prop.MORE, {
        text: games2
      })
    })

    // Left button to -1 of scores
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 150,
      y: 400,
      w: 80,
      h: 55,
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: '-1',
      text_size: 40,
      color: 0xffffff,
      radius: 20,
      click_func: (button_widget) => {
        if (scores1 == 0 && games1 > 0) {
          games1--
          gamesWidget1.setProperty(hmUI.prop.MORE, {
            text: games1
          })
        }

        if (scores1 > 0) {
          scores1--
          scoresWidget1.setProperty(hmUI.prop.MORE, {
            x: 0,
            y: 0,
            w: (466 - 233),
            h: 466,
            text: scores1
          })
        }
      }
    })

    // Right button to -1 of scores
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 237,
      y: 400,
      w: 80,
      h: 55,
      normal_color: 0x2c79cc,
      press_color: 0x5895f0,
      text: '-1',
      text_size: 40,
      color: 0xffffff,
      radius: 20,
      click_func: (button_widget) => {
        if (scores2 == 0 && games2 > 0) {
          games2--
          gamesWidget2.setProperty(hmUI.prop.MORE, {
            text: games2
          })
        }

        if (scores2 > 0) {
          scores2--
          scoresWidget2.setProperty(hmUI.prop.MORE, {
            x: 234,
            y: 0,
            w: (466 - 233),
            h: 466,
            text: scores2
          })
        }
      }
    })
  }
})