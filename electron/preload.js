const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('desktopCapturer', {
  screenshot: () => ipcRenderer.invoke('rendererInvoke:screenshot'), // 截图
  startRecord: () => ipcRenderer.invoke('rendererInvoke:startRecord'), // 开始录屏
  stopRecord: data => ipcRenderer.invoke('rendererInvoke:stopRecord', data), // 结束录屏
  // 从缓存获取关闭窗口设置
  getCloseAction: () => {
    ipcRenderer.send('rendererSend:getCloseAction')

    return new Promise((resolve) => {
      ipcRenderer.on('mainReplay:closeAction', (event, closeAction) => {
        resolve(closeAction)
      })
    })
  },
  setCloseAction: closeAction => ipcRenderer.send('rendererInvoke:setCloseAction', closeAction), // 关闭窗口设置
  // 从缓存获取保存路径
  getSavePath: () => {
    ipcRenderer.send('rendererSend:getSavePath')

    return new Promise((resolve) => {
      ipcRenderer.on('mainReply:savePath', (event, savePath) => {
        resolve(savePath)
      })
    })
  },
  setSavePath: () => ipcRenderer.invoke('rendererInvoke:setSavePath'), // 保存路径设置
  // 从缓存获取截图快捷键
  getScreenshotShortcut: () => {
    ipcRenderer.send('rendererSend:getScreenShortcut')

    return new Promise((resolve) => {
      ipcRenderer.on('mainReply:screenshotShortcut', (event, screenshotShortcut) => {
        resolve(screenshotShortcut)
      })
    })
  },
  setScreenshotShortcut: keyCode => ipcRenderer.invoke('rendererInvoke:setScreenshotShortcut', keyCode) // 设置截图快捷键
})