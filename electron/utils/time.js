const { format } = require('date-fns')

module.exports = {
  // 获取当前时间字符串，作为文件名标识，防止文件重名
  getTimeString: () => {
    return format(new Date(), 'yyyyMMddHHmmss')
  }
}