const moment = require('moment')
const { weather } = require('../../api')
const { random } = require('../../utils/index')

const weekType = {
  '0': '星期日',
  '1': '星期一',
  '2': '星期二',
  '3': '星期三',
  '4': '星期四',
  '5': '星期五',
  '6': '星期六',
}

const weatherMsg = {
  async getWeatherMsg (city) {
    const resData = await weather.getWeather(city)
    console.log('data:', resData)
    let text = ''
    // 地址不能带'市|区'
    if (!resData.data || resData.city !== city) {
      text = '请输入正确的地址，不然臣妾也不知道哇Σ(*ﾟдﾟﾉ)ﾉ'
    } else {
      const todayWea = resData.data[0]
      const idx = random(0, 5)
      text = `${resData.city}：${moment().format('MM月DD日')} ${weekType[moment().day()]}，${todayWea.wea}，白天气温${todayWea.tem1}，晚上气温${todayWea.tem2}，${idx === 1 ? '运动指数' : todayWea.index[idx].title}：${todayWea.index[idx].desc}【此天气预报由帅帅的群主独家冠名赞助】`
    }
    return {
      type: 'text',
      data: { text }
    }
  }
}
module.exports = weatherMsg