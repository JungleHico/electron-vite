const { app, ipcMain, dialog } = require('electron')
const { getGlobalInstance } = require('../classes/Global')
const Store = require('electron-store')

// 全部变量
const _global = getGlobalInstance({
  mainWindow: null, // 主窗口
  quitOnClose: false, // 关闭窗口是否退出程序
  savePath: '' // 文件目录
})
const store = new Store()

// 初始化数据
function initData() {
  _global.quitOnClose = store.get('closeAction', 'tray') === 'quit' // 'quit'：退出，'tray'：最小化到托盘
  _global.savePath = store.get('savePath', app.getPath('desktop')) // 保存路径

  // 向渲染进程传递数据
  ipcMain.on('renderer:getCloseAction', event => {
    event.reply('main:closeAction', _global.quitOnClose ? 'quit' : 'tray')
  })
  ipcMain.on('renderer:getSavePath', event => {
    event.reply('main:savePath', _global.savePath)
  })
  // 监听渲染进程传值
  ipcMain.on('renderer:closeAction', (event, value) => {
    _global.quitOnClose = value
    store.set('closeAction', _global.quitOnClose)
  })
  ipcMain.handle('deskCapturer:setSavePath', async () => {
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
  })
}

module.exports = {
  initData
}
