const api = require('./axios') // api封装
const aes = require('./aes')
const common = require('./common')
const utils = {
  api,
  ...aes,
  ...common
}

module.exports = utils