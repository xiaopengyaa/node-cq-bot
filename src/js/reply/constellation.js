const cheerio = require('cheerio')
const { constellationApi } = require('../../api')

const constellationMap = {
  Aries: '白羊座',
  Taurus: '金牛座',
  Gemini: '双子座',
  Cancer: '巨蟹座',
  Leo: '狮子座',
  Virgo: '处女座',
  Libra: '天秤座',
  Scorpio: '天蝎座',
  Sagittarius: '射手座',
  Capricorn: '摩羯座',
  Aquarius: '水瓶座',
  Pisces: '双鱼座',
}

const constellationMsg = [
  {
    name: 'constellation',
    rule: /^\[CQ:at,qq=\d+\]([\s\S]*)运势$/,
    async message (msg) {
      let text = ''
      let constellationName = ''
      Object.entries(constellationMap).forEach(item => {
        const [name, value] = item
        value === msg && (constellationName = name)
      })
      if (constellationName) {
        const html = await constellationApi.getConstellation(constellationName)
        const $ = cheerio.load(html)
        text = `【${msg}今日运势】\r\n`
        // 指数值
        $('.fraction div').each((index, elem) => {
          text += `\r\n${$(elem).find('b').text()}指数：${$(elem).find('strong').text()}`
        })
        // 运势
        text += `\r\n\r\n${$('.det .txt p').text()}\r\n`
        // 幸运值
        $('.quan_yuan li').each((index, elem) => {
          text += `\r\n${$(elem).find('.words_b').text()}：${$(elem).find('.words_t').text()}`
        })
      } else {
        text = '请输入正确的星座名Σ(*ﾟдﾟﾉ)ﾉ'
      }
      return text
    }
  }
]

module.exports = constellationMsg