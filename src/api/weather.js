const { api } = require('../utils')

const url = {
  weather: 'https://www.tianqiapi.com/api/'
}

const weather = {
  // 天气
  async getWeather(city) {
    let reqData = {
      version: 'v1',
      appid: '33387112',
      appsecret: '2lPP2oBf',
      city
    }
    const res = await api.get(url.weather, reqData, { timeout: 4000 })
    return res
  }
}

module.exports = weather