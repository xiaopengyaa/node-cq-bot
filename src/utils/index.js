const api = require('./axios') // api封装
const utils = {
  api,
  // 生成随机范围数
  random (min, max) {
    return Math.round(Math.random() * (max - min)) + min
  }
}

module.exports = utils