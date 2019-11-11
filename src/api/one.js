const { api } = require('../utils')

const url = {
  one: 'http://wufazhuce.com/'
}

const oneApi = {
  // 每日一句
  async getOne() {
    const data = await api.get(url.one)
    return data
  }
}

module.exports = oneApi