import * as hmUI from '@zos/ui'
import { gettext } from 'i18n'
import { log as Logger } from '@zos/utils'
import { px } from '@zos/utils'
import { getDeviceInfo } from '@zos/device'

Page({
  build() {
    let count = 0
    
    // const text = hmUI.createWidget(hmUI.widget.TEXT, {
    //   x: 96,
    //   y: 120,
    //   w: 288,
    //   h: 46,
    //   color: 0xffffff,
    //   text_size: 12,
    //   align_h: hmUI.align.LEFT,
    //   align_v: hmUI.align.BOTTOM,
    //   text_style: hmUI.text_style.NONE,
    //   text: 'Player1'
    // })

    //this.buildTopContent(count)

    // const text2 = hmUI.createWidget(hmUI.widget.TEXT, {
    //   x: 96,
    //   y: 120,
    //   w: 288,
    //   h: 46,
    //   color: 0xffffff,
    //   text_size: 12,
    //   align_h: hmUI.align.RIGHT,
    //   align_v: hmUI.align.BOTTOM,
    //   text_style: hmUI.text_style.NONE,
    //   text: 'Player2'
    // })

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 0,
      y: 0,
      w: (466 - 233),
      h: 466,
      normal_color: 0x2c79cc,
      press_color: 0x5895f0,
      text: count,
      text_size: 100,
      color: 0xfc6950,
      click_func: (button_widget) => {
        this.count ++
      }
    })

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 234,
      y: 0,
      w: (466 - 233),
      h: 466,
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: count,
      text_size: 100,
      color: 0x2c79cc,
      click_func: (button_widget) => {
        count ++
      }
    })
  }
})