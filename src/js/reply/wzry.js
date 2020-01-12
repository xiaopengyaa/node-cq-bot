const cheerio = require('cheerio')
const { wzry } = require('../../api')

const wzryMsg = [
  {
    name: 'wzry',
    rule: /^\[CQ:at,qq=\d+\]([\s\S]*)出装$/,
    async message (msg) {
      let text = ''
      const heroList = await wzry.getWzryHeroList()
      const [hero] = heroList.filter(item => item.cname === msg)
      if (hero) {
        const equipList = await wzry.getWzryEquipList()
        const html = await wzry.getWzryHeroDetail(hero.ename)
        const $ = cheerio.load(html)
        // 获取推荐出装
        const recommendEquipIdList = $('.equip-list').first().attr('data-item').split('|')
        const tips = $('.equip-tips').first().text()
        if (recommendEquipIdList.length > 0) {
          text = `${msg}出装：`
          recommendEquipIdList.forEach(id => {
            const [equip] = equipList.filter(item => item.item_id.toString() === id)
            equip && (text += `${equip.item_name} `)
          })
          text += `\r\n\r\n${tips}`
        }
      } else {
        text = '亲，输入的英雄名字不对哟'
      }
      return text
    }
  },
  {
    name: 'wzry',
    rule: /^\[CQ:at,qq=\d+\]([\s\S]*)铭文$/,
    async message (msg) {
      let text = ''
      const heroList = await wzry.getWzryHeroList()
      const [hero] = heroList.filter(item => item.cname === msg)
      if (hero) {
        const mingWenList = await wzry.getWzryMingWenList()
        const html = await wzry.getWzryHeroDetail(hero.ename)
        const $ = cheerio.load(html)
        // 获取推荐铭文
        const recommendMingWenIdList = $('.sugg-u1').attr('data-ming').split('|')
        const tips = $('.sugg-tips').text()
        if (recommendMingWenIdList.length > 0) {
          text = `${msg}铭文：`
          recommendMingWenIdList.forEach(id => {
            const [mingWen] = mingWenList.filter(item => item.ming_id.toString() === id)
            mingWen && (text += `${mingWen.ming_name} `)
          })
          text += `\r\n\r\n${tips}`
        }
      } else {
        text = '亲，输入的英雄名字不对哟'
      }
      return text
    }
  }
]
module.exports = wzryMsg