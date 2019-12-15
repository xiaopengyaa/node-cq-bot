const iconvLite = require('iconv-lite')
const { api } = require('../utils')

const url = {
  wzryNews: 'https://apps.game.qq.com/wmp/v3.1/',
  wzryNewInfo: 'https://pvp.qq.com/m/m201706/coming/index.htm',
  wzryMatch (num) {
    return `https://itea-cdn.qq.com/file/ingame/smoba/allMatchpage${num}.json`
  }
}

const wzry = {
  // 王者荣耀比赛信息
  async getWzryMatch(num) {
    const res = await api.get(url.wzryMatch(num))
    return res && res.matchList || []
  },
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
    return data && data.status === 0 ? data.msg.result : []
  },
  // 王者荣耀新英雄、新皮肤信息
  async getWzryNewInfo () {
    const data = await api.get(url.wzryNewInfo, null, { responseType: 'arraybuffer' })
    return iconvLite.decode(data, 'gbk')
  }
}

module.exports = wzry