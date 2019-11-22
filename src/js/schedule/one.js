const cheerio = require('cheerio')
const moment = require('moment')
const { oneApi } = require('../../api')

const one = {
  async getOneList() {
    const data = await oneApi.getOne()
    const $ = cheerio.load(data)
    const text = $('#carousel-one .fp-one-cita a').eq(0).text()
    const countDown = moment('2020-01-24').diff(moment().format('YYYY-MM-DD'), 'days') // 除夕倒计时
    let festivalText = ''
    if (countDown > 0) {
      festivalText = `\r\n\r\n温馨提示：离【除夕】还有${countDown}天[CQ:face,id=175]`
    } else if (countDown === 0) {
      festivalText = '\r\n\r\n温馨提示：祝大家除夕快乐呀[CQ:face,id=175]'
    }
    console.log('每日一句：', text)
    return [`【每日一句】\r\n\r\n${text}${festivalText}`]
  }
}
module.exports = one