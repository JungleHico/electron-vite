const { app, ipcMain, dialog, globalShortcut } = require('electron')
const { getGlobalInstance } = require('../models/Global')
const Store = require('electron-store')
const { handleScreenshot } = require('./ipcHandler')

const _global = getGlobalInstance() // 全局变量
const store = new Store() // 实例化 Electron Store

_global.closeAction = 'quit'

function initSettings() {
  // 从缓存中获取关闭窗口设置，默认为最小化到托盘
  _global.closeAction = store.get('closeAction', 'tray')
  // 从缓存中获取保存路径，默认为桌面
  _global.savePath = store.get('savePath', app.getPath('desktop'))
  // 从缓存中获取截图快捷键，如果有则注册
  let screenshotShortcut = store.get('screenshotShortcut', '')
  if (screenshotShortcut !== '') {
    globalShortcut.register(screenshotShortcut, () => {
      handleScreenshot(_global.mainWindow)
    })
  }

  // 向渲染进程传递数据
  ipcMain.on('rendererSend:getCloseAction', event => {
    event.reply('mainReplay:closeAction', _global.closeAction)
  })
  ipcMain.on('rendererSend:getSavePath', event => {
    event.reply('mainReply:savePath', _global.savePath)
  })
  ipcMain.on('rendererSend:getScreenShortcut', event => {
    event.reply('mainReply:screenshotShortcut', screenshotShortcut)
  })

  // 主进程响应，更新设置和缓存
  ipcMain.on('rendererInvoke:setCloseAction',
    (event, closeAction) => handleSetCloseAction(closeAction))
  ipcMain.handle('rendererInvoke:setSavePath', handleSetSavePath)
  ipcMain.handle('rendererInvoke:setScreenshotShortcut',
    (event, keyCode) => handleSetScreenshotShortCut(keyCode))
}

// 修改关闭窗口设置
function handleSetCloseAction(closeAction) {
  _global.closeAction = closeAction
  store.set('closeAction', _global.closeAction)
}

// 修改保存路径
async function handleSetSavePath() {
  const result = await dialog.showOpenDialog(_global.mainWindow, {
    defaultPath: _global.savePath,
    buttonLabel: '选择',
    properties: ['openDirectory']
  })
  if (!result.canceled) {
    _global.savePath = result.filePaths[0]
    store.set('savePath', _global.savePath)
    return _global.savePath
  }
}

// 修改截图快捷键
function handleSetScreenshotShortCut(keyCode) {
  try {
    // 注册快捷键
    globalShortcut.register(keyCode, () => {
      handleScreenshot(_global.mainWindow)
    })
    const oldShortcut = store.get('screenshotShortcut', '')
    if (oldShortcut !== '') {
      globalShortcut.unregister(oldShortcut) // 注销旧快捷键
    }
    store.set('screenshotShortcut', keyCode) // 缓存快捷键
    return true
  } catch (error) {
    return false
  }
}

module.exports = {
  initSettings
}