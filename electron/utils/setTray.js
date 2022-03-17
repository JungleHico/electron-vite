const { Tray, Menu, app } = require('electron')
const path = require('path')
const { getGlobalInstance } = require('../classes/Global')

const _global = getGlobalInstance()

// 设置系统托盘
function setTray() {
  const tray = new Tray(path.resolve(__dirname, '../assets/logo.png'))

  tray.setToolTip('Electron截图录屏')

  const menu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: () => {
        _global.quitOnClose = true
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

module.exports = setTray