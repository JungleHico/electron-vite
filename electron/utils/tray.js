const { Tray, Menu, app } = require('electron')
const path = require('path')
const { getGlobalInstance } = require('../models/Global')

function setTray() {
  const _global = getGlobalInstance()

  const tray = new Tray(path.resolve(__dirname, '../assets/logo.png'))

  // 鼠标滑过图标显示文字
  tray.setToolTip('Electron截图录屏')

  // 右键菜单
  const menu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: () => {
        _global.closeAction = 'quit'
        app.quit() // 关闭应用
      }
    }
  ])

  tray.setContextMenu(menu)

  // 点击托盘图标，打开窗口
  tray.on('click', () => {
    _global.mainWindow.show()
  })
}

module.exports = {
  setTray
}