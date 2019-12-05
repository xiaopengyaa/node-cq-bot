const api = require('./axios') // api封装
const aes = require('./aes')
const common = require('./common')
const decrypMusic = require('./decryptMusic')
const scheduleJob = require('./scheduleJob')
const utils = {
  api,
  decrypMusic,
  scheduleJob,
  ...aes,
  ...common
}

module.exports = utils