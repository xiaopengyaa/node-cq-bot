const { cqMsg } = require('../../utils')

// 自动聊天回复
const chatMsg = [
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*功能$/,
    message () {
      const text = 
    `现有功能：

      【101】王者荣耀推送

      【102】查看天气

      【103】每日一句

      【104】点歌

      【250】查看更多功能

    @小迷弟+编号可以获取功能详情`
      return cqMsg(text)
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*101$/,
    message () {
      return cqMsg('【王者荣耀推送】小迷弟会把王者荣耀每天最新的公告、活动、新英雄、新皮肤等资讯推送给大家哟。')
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*102$/,
    message () {
      return cqMsg('【查看天气】@小迷弟+地方名+“天气”即可查看当天的天气哟。PS：地方名不能带 “市” “区” 等字眼哟。')
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*103$/,
    message () {
      return cqMsg('【每日一句】每天早上8点都会有一份鸡汤，让您精神满满，嘿嘿')
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*104$/,
    message () {
      return cqMsg('【点歌】@小迷弟+“点歌”+歌名即可点歌')
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*250$/,
    message () {
      return cqMsg('亲，洗洗睡吧，没有更多功能了啦Σ(*ﾟдﾟﾉ)ﾉ')
    }
  }
]

module.exports = chatMsg
