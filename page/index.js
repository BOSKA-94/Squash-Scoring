import * as hmUI from '@zos/ui'
import { gettext } from 'i18n'
import { log as Logger } from '@zos/utils'
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '../../calories/utils/styles-gts-3'

Page({
  build() {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 0,
      y: 0,
      w: (DEVICE_WIDTH - px(233)),
      h: DEVICE_HEIGHT,
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
      w: (DEVICE_WIDTH - px(233)),
      h: DEVICE_HEIGHT,
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