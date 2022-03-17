// ipc实践处理
const {
  ipcMain,
  screen,
  desktopCapturer,
  dialog,
  globalShortcut
} = require('electron')
const { getGlobalInstance } = require('../classes/Global')
const Store = require('electron-store')
const fs = require('fs')
const { getTimeString } = require('./time')

const _global = getGlobalInstance()
const store = new Store()

module.exports = {
  setIpcHandles: () => {
    // 主进程响应事件
    ipcMain.handle('deskCapturer:screenshot', () => handleScreenshot(_global.mainWindow)) // 截图
    ipcMain.handle('deskCapturer:startRecord', handleStartRecord), // 开始录屏
    ipcMain.handle('deskCapturer:stopRecord', (event, dataView) => handleStopRecord(dataView, _global.mainWindow)) // 结束录屏
    ipcMain.handle('deskCapturer:setScreenshotShortcut', (event, keyCode) => handleSetScreenshotShortCut(keyCode)) // 设置截图快捷键

    // 向渲染进程传递数据
    // 传递截图快捷键
    ipcMain.on('renderer:getScreenShortcut', event => {
      event.reply('main:screenshotShortcut', store.get('screenshotShortcut', ''))
    })
  },
  handleScreenshot
}

// 截图
async function handleScreenshot(win) {
  // 获取屏幕宽度
  const { width, height } = screen.getPrimaryDisplay().size

  // 捕获屏幕
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width, height }
  })

  // 打开文件对话框
  const path = await dialog.showSaveDialog(win, {
    title: '保存截图',
    defaultPath: `${_global.savePath}/截图_${getTimeString()}`,
    filters: [
      { name: 'Images', extensions: ['png'] }
    ]
  })

  // 保存图片
  if (path?.filePath) {
    fs.writeFile(path.filePath, sources[0].thumbnail.toPNG(), error => {
      if (error) {
        console.log(error)
        return
      }
    })
  }
}

// 开始录屏
async function handleStartRecord() {
  // 捕获屏幕
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
  })
  return sources[0].id
}

// 结束录屏
async function handleStopRecord(dataView, win) {
  // 打开文件对话框
  const path = await dialog.showSaveDialog(win, {
    title: '保存截图',
    defaultPath: `${_global.savePath}/录屏_${getTimeString()}`,
    filters: [
      { name: 'Movies', extensions: ['mp4'] }
    ]
  })

    // 保存视频
  if (path?.filePath) {
    fs.writeFile(path.filePath, dataView, error => {
      if (error) {
        console.log(error)
        return
      }
    })
  }
}

function handleSetScreenshotShortCut(keyCode) {
  try {
    globalShortcut.register(keyCode, () => {
      handleScreenshot(_global.mainWindow) // 快捷键执行截图
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