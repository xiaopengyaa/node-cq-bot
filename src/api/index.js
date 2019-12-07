
const wzry = require('./wzry') // 王者荣耀文章
const oneApi = require('./one') // 每日一句
const weather = require('./weather') // 天气预报
const song = require('./song') // 音乐
const ticketApi = require('./ticket') // 火车票查询

const api = {
  wzry,
  oneApi,
  weather,
  song,
  ticketApi
}

module.exports = api