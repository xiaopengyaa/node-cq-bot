const api = require('./axios') // api封装
const aes = require('./aes')
const common = require('./common')
const decrypMusic = require('./decryptMusic')
const utils = {
  api,
  decrypMusic,
  ...aes,
  ...common
}

module.exports = utils