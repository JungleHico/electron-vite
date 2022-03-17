const { globalShortcut } = require('electron')
const { getGlobalInstance } = require('../classes/Global')
const Store = require('electron-store')
const { handleScreenshot } = require('./ipcHandler')

const _global = getGlobalInstance()
const store = new Store()

module.exports = {
  // 初始化快捷键
  initGlobalShortcut: () => {
    setScreenshotShortcut()
  }
}

// 初始化截图快捷键
function setScreenshotShortcut() {
  const screenshotShortcut = store.get('screenshotShortcut', '')
  if (screenshotShortcut !== '') {
    globalShortcut.register(screenshotShortcut, () => {
      handleScreenshot(_global.mainWindow) // 快捷键执行截图
    })
  }
}