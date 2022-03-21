const { ipcMain, screen, desktopCapturer, dialog } = require('electron')
const { getTimeString } = require('./time')
const fs = require('fs')
const { getGlobalInstance } = require('../models/Global')

const _global = getGlobalInstance()

module.exports = {
  setIpcHandler: () => {
    ipcMain.handle('rendererInvoke:screenshot', () => handleScreenshot()), // 截图
    ipcMain.handle('rendererInvoke:startRecord', handleStartRecord), // 开始录屏
    ipcMain.handle('rendererInvoke:stopRecord', (event, data) => handleStopRecord(data)) // 结束录屏
  },
  handleScreenshot
}

// 截图
async function handleScreenshot() {
  // 获取屏幕宽度
  const { width, height } = screen.getPrimaryDisplay().size

  // 捕获屏幕
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width, height }
  })

  // 打开文件对话框
  const path = await dialog.showSaveDialog(_global.mainWindow, {
    title: '保存截图',
    defaultPath: `${_global.savePath}/截图_${getTimeString()}`,
    filters: [
      { name: 'Images', extensions: ['png'] }
    ]
  })

  // 保存图片
  if (path.filePath) {
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
async function handleStopRecord(data) {
  // 打开文件对话框
  const path = await dialog.showSaveDialog(_global.mainWindow, {
    title: '保存截图',
    defaultPath: `${_global.savePath}/录屏_${getTimeString()}`,
    filters: [
      { name: 'Movies', extensions: ['mp4'] }
    ]
  })

  // 保存视频
  if (path.filePath) {
    fs.writeFile(path.filePath, data, error => {
      if (error) {
        console.log(error)
        return
      }
    })
  }
}
