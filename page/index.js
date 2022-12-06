import * as hmUI from '@zos/ui'
import { gettext } from 'i18n'
import { log as Logger } from '@zos/utils'
import { px } from '@zos/utils'
import { getDeviceInfo } from '@zos/device'

Page({
  build() {
    let count1 = 0
    let count2 = 0
    let games1 = 0
    let games2 = 0

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 0,
      y: 0,
      w: (466 - 233),
      h: 466,
      normal_color: 0x2c79cc,
      press_color: 0x5895f0,
      text: count1,
      text_size: 120,
      color: 0xfc6950,
      click_func: (button_widget) => {
        count1++
        if (count1 == 11) {
          //games1++
          count1 = 0
        }
        button_widget.setProperty(hmUI.prop.MORE, {
          x: 0,
          y: 0,
          w: (466 - 233),
          h: 466,
          text: count1
        })
      }
    })

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 234,
      y: 0,
      w: (466 - 233),
      h: 466,
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: count2,
      text_size: 120,
      color: 0x2c79cc,
      click_func: (button_widget) => {
        count2++
        if (count2 == 11) {
          //games2++
          count2 = 0
        }
        button_widget.setProperty(hmUI.prop.MORE, {
          x: 234,
          y: 0,
          w: (466 - 233),
          h: 466,
          text: count2
        })
      }
    })

    const gamesTotal1 = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 110,
      y: 20,
      w: 288,
      h: 60,
      color: 0xffffff,
      text_size: 50,
      align_h: hmUI.align.LEFT,
      align_v: hmUI.align.TOP,
      text_style: hmUI.text_style.NONE,
      text: games1
    })

    gamesTotal1.addEventListener(hmUI.event.CLICK_DOWN, (info) => {
      games1++
      gamesTotal1.setProperty(hmUI.prop.MORE, {
        text: games1
      })
    })

    const gamesTotal2 = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 336,
      y: 20,
      w: 288,
      h: 60,
      color: 0xffffff,
      text_size: 50,
      align_h: hmUI.align.LEFT,
      align_v: hmUI.align.TOP,
      text_style: hmUI.text_style.NONE,
      text: games2
    })

    gamesTotal2.addEventListener(hmUI.event.CLICK_DOWN, (info) => {
      games2++
      gamesTotal2.setProperty(hmUI.prop.MORE, {
        text: games2
      })
    })




  }
})