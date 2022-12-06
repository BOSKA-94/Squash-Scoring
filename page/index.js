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
      text_size: 100,
      color: 0xfc6950,
      click_func: (button_widget) => {
        count1++
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
      text_size: 100,
      color: 0x2c79cc,
      click_func: (button_widget) => {
        count2++
        button_widget.setProperty(hmUI.prop.MORE, {
          x: 234,
          y: 0,
          w: (466 - 233),
          h: 466,
          text: count2
        })
      }
    })
  }
})