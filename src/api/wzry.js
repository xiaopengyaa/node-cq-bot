const fs = require('querystring')
const { api } = require('../utils')

const url = {
  wzryNews: 'https://apps.game.qq.com/wmp/v3.1/'
}

const wzry = {
  // 王者荣耀文章 id: 1762为公告|1763为活动
  async getWzryNews(extraData = {}) {
    const reqData = {
      p0: 18,
      p1: 'searchNewsKeywordsList',
      page: 1,
      pagesize: 10,
      order: 'sIdxTime',
      r0: 'cors',
      r1: 'NewsObj',
      type: 'iTarget',
      ...extraData
    }
    const config = {
      headers: {
        Referer: 'https://pvp.qq.com/m/m201706/newsList.shtml'
      }
    }
    const data = await api.get(url.wzryNews, reqData, config)
    return data.status === 0 ? data.msg.result : []
  }
}

module.exports = wzry