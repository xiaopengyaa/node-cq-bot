const moment = require('moment')
const { weather } = require('../../api')
const { random, isTimeout } = require('../../utils')

const weekType = {
  '0': '星期日',
  '1': '星期一',
  '2': '星期二',
  '3': '星期三',
  '4': '星期四',
  '5': '星期五',
  '6': '星期六',
}
const thanksWords = [
  '【此天气预报由帅帅的群主独家冠名赞助】',
  '【感谢不懈追求完美的群主对本天气预报的大力支持】',
  '【此天气预报由温文尔雅、博学多才的群主顶力支持】',
  '【特别感谢低调、稳重、潇洒、豁达的群主对本天气预报的独家冠名赞助】',
  '【此天气预报由也许我的肩膀不够宽广、但足以为你遮挡风雨的群主大力支持】',
  '【感谢文能提笔安天下、武能上马定乾坤的群主对本天气预报提供技术支持】',
  '【此天气预报由上知天文下知地理、通宵古今学贯中西的群主提供技术支持】'
]

const weatherMsg = {
  async getWeatherMsg (city) {
    const resData = await weather.getWeather(city)
    let text = ''
    // 地址不能带'市|区'
    if (isTimeout(resData)) {
      text = '请求超时呢，人家累啦，先休息一会儿~'
    } else if (!resData.data || resData.city !== city) {
      text = '请输入正确的地址，不然臣妾也不知道哇Σ(*ﾟдﾟﾉ)ﾉ'
    } else {
      const todayWea = resData.data[0]
      const idx = random(0, todayWea.index.length - 1) // 随机指数
      const randomWordsIdx = random(0, thanksWords.length - 1)
      text = `${resData.city}：${moment().format('MM月DD日')} ${weekType[moment().day()]}，${todayWea.wea}，白天气温${todayWea.tem1}，晚上气温${todayWea.tem2}，${idx === 1 ? '运动指数' : todayWea.index[idx].title}：${todayWea.index[idx].desc}${thanksWords[randomWordsIdx]}`
    }
    return {
      type: 'text',
      data: { text }
    }
  }
}
module.exports = weatherMsg