// 全局单例，用于保存全局变量
class Global {
  constructor() {}

  static getGlobalInstance(options) {
    if (!Global._instance) {
      Global._instance = new Global(options)
    }
    return Global._instance
  }
}

module.exports = Global