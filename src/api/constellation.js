const { api } = require('../utils')

const url = {
  constellation (constellation) {
    return `https://www.d1xz.net/yunshi/today/${constellation}`
  }
}

const constellationApi = {
  // 今日星座运势
  async getConstellation(constellation) {
    const res = await api.get(url.constellation(constellation))
    return res
  }
}

module.exports = constellationApi