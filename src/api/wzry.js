const iconvLite = require('iconv-lite')
const { api } = require('../utils')

const url = {
  wzryNews: 'https://apps.game.qq.com/wmp/v3.1/',
  wzryNewInfo: 'https://pvp.qq.com/m/m201706/coming/index.htm',
  wzryMatch (num) {
    return `https://itea-cdn.qq.com/file/ingame/smoba/allMatchpage${num}.json`
  },
  wzryHeroList: 'https://pvp.qq.com/web201605/js/herolist.json',
  wzryEquipList: 'https://pvp.qq.com/web201605/js/item.json',
  wzryMingWenList: 'https://pvp.qq.com/web201605/js/ming.json',
  wzryHeroDetail (id) {
    return `https://pvp.qq.com/web201605/herodetail/${id}.shtml`
  }
}

const wzry = {
  // 王者荣耀英雄列表
  async getWzryHeroList() {
    const res = await api.get(url.wzryHeroList)
    return res || []
  },
  // 王者荣耀铭文列表
  async getWzryMingWenList() {
    const res = await api.get(url.wzryMingWenList)
    return res || []
  },
  // 王者荣耀装备列表
  async getWzryEquipList() {
    const res = await api.get(url.wzryEquipList)
    return res || []
  },
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
  },
  // 王者荣耀英雄详情
  async getWzryHeroDetail (id) {
    const data = await api.get(url.wzryHeroDetail(id), null, { responseType: 'arraybuffer' })
    return iconvLite.decode(data, 'gbk')
  }
}

module.exports = wzry