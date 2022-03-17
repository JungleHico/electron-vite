const { contextBridge, ipcRenderer } = require('electron')

// 对渲染进程暴露ipc通道
contextBridge.exposeInMainWorld('deskCapturer', {
  screenshot: () => ipcRenderer.invoke('deskCapturer:screenshot'), // 截图
  startRecord: () => ipcRenderer.invoke('deskCapturer:startRecord'), // 开始录屏
  stopRecord: dataView => ipcRenderer.invoke('deskCapturer:stopRecord', dataView), // 结束录屏
  // 从缓存获取关闭窗口设置
  getCloseAction: () => {
    ipcRenderer.send('renderer:getCloseAction')

    return new Promise((resolve) => {
      ipcRenderer.on('main:closeAction', (event, closeAction) => {
        resolve(closeAction)
      })
    })
  },
  setCloseAction: closeAction => ipcRenderer.send('renderer:closeAction', closeAction), // 关闭窗口设置
  // 从缓存获取保存路径
  getSavePath: () => {
    ipcRenderer.send('renderer:getSavePath')

    return new Promise((resolve) => {
      ipcRenderer.on('main:savePath', (event, savePath) => {
        resolve(savePath)
      })
    })
  },
  setSavePath: () => ipcRenderer.invoke('deskCapturer:setSavePath'), // 保存路径设置
  // 从缓存获取截图快捷键
  getScreenshotShortcut: () => {
    ipcRenderer.send('renderer:getScreenShortcut')

    return new Promise((resolve) => {
      ipcRenderer.on('main:screenshotShortcut', (event, screenshotShortcut) => {
        resolve(screenshotShortcut)
      })
    })
  },
  setScreenshotShortcut: keyCode => ipcRenderer.invoke('deskCapturer:setScreenshotShortcut', keyCode) // 设置截图快捷键
})