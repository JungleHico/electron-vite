const { app, BrowserWindow } = require('electron')
const path = require('path')
const { getGlobalInstance } = require('./models/Global')
const { setIpcHandler } = require('./utils/ipcHandler')
const { initSettings } = require('./utils/settings')
const { setTray } = require('./utils/tray')

const _global = getGlobalInstance() // 全局变量

function createWindow() {
  if (!_global.mainWindow) {
    _global.mainWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      webPreferences: {
        preload: path.resolve(__dirname, 'preload.js')
      }
    })
  
    _global.mainWindow.loadURL('http://localhost:3000')

    // 关闭时隐藏窗口/退出应用
    _global.mainWindow.on('close', e => {
      if (_global.closeAction !== 'quit') {
        e.preventDefault()
        _global.mainWindow.hide()
      }
    })
  
    // 主进程响应事件
    setIpcHandler()
  }
}

app.whenReady().then(() => {
  createWindow()

  initSettings()

  setTray()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'datwin') {
    app.quit()
  }
})

app.on('activate', () => {
  createWindow()
})