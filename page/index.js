import * as hmUI from '@zos/ui'
import { gettext } from 'i18n'
import { log as Logger } from '@zos/utils'
import { px } from '@zos/utils'
import { getDeviceInfo } from '@zos/device'

Page({
  build() {
    const text = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 96,
      y: 120,
      w: 288,
      h: 46,
      color: 0xffffff,
      text_size: 12,
      align_h: hmUI.align.LEFT,
      align_v: hmUI.align.BOTTOM,
      text_style: hmUI.text_style.NONE,
      text: 'Player1'
    })

    const text2 = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 96,
      y: 120,
      w: 288,
      h: 46,
      color: 0xffffff,
      text_size: 12,
      align_h: hmUI.align.RIGHT,
      align_v: hmUI.align.BOTTOM,
      text_style: hmUI.text_style.NONE,
      text: 'Player2'
    })

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 0,
      y: 0,
      w: (466 - px(233)),
      h: 466,
      normal_color: 0x2c79cc,
      press_color: 0xfeb4a8,
      text: 'Player1',
      click_func: (button_widget) => {
        button_widget.setProperty(hmUI.prop.MORE, {
          x: (480 - 400) / 2,
          y: 300,
          w: 400,
          h: 100
        })
      }
    })

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 250,
      y: 0,
      w: (466 - px(233)),
      h: 466,
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: 'Player2',
      click_func: (button_widget) => {
        button_widget.setProperty(hmUI.prop.MORE, {
          x: (480 - 400) / 2,
          y: 300,
          w: 400,
          h: 100
        })
      }
    })
  }
})