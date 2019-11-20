const cheerio = require('cheerio')
const { oneApi } = require('../../api')

const one = {
  async getOneList() {
    const data = await oneApi.getOne()
    const $ = cheerio.load(data)
    const text = $('#carousel-one .fp-one-cita a').eq(0).text()
    console.log(text)
    return [`【每日一句】\r\n${text}`]
  }
}

module.exports = one