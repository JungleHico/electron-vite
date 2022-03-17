const { BrowserWindow, app } = require('electron')
const path = require('path')
const { getGlobalInstance } = require('./classes/Global')
const { initData } = require('./utils/initData')
const { initGlobalShortcut } = require('./utils/globalShortcut')
const { setIpcHandles } = require('./utils/ipcHandler')
const setTray = require('./utils/setTray')

const _global = getGlobalInstance() // 全局变量

// 创建窗口
function createWindow() {
  if (!_global.mainWindow) {
    _global.mainWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      webPreferences: {
        preload: path.resolve(__dirname, './preload.js')
      }
    })
  
    _global.mainWindow.loadURL('http://localhost:3000')
  
    // 自动打开调试工具
    _global.mainWindow.webContents.openDevTools()
  
    // 关闭时隐藏窗口/退出应用
    _global.mainWindow.on('close', e => {
      if (!_global.quitOnClose) {
        e.preventDefault()
        _global.mainWindow.hide()
      }
    })
  
    // 响应ipc事件
    setIpcHandles()
  }
}

// 应用初始完成
app.whenReady().then(() => {
  createWindow() // 创建窗口
  
  initData() // 初始化数据

  initGlobalShortcut() // 初始化快捷键
  
  setTray() // 设置系统托盘
})

app.on('window-all-closed', () => {
  if (process.platform !== 'datwin') {
    app.quit()
  }
})

app.on('activate', () => {
  createWindow()
})
