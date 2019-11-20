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

      【105】帮@所有人

      【250】查看更多功能

    @小迷弟+编号可以获取功能详情`
      return text
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*101$/,
    message () {
      return '【王者荣耀推送】小迷弟会把王者荣耀每天最新的公告、活动、比赛信息、新英雄、新皮肤等资讯推送给大家哟。'
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*102$/,
    message () {
      return '【查看天气】@小迷弟+地方名+“天气”即可查看当天的天气哟。PS：地方名不能带 “市” “区” 等字眼哟。'
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*103$/,
    message () {
      return '【每日一句】每天早上8点都会有一份鸡汤，让您精神满满，嘿嘿'
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*104$/,
    message () {
      return '【点歌】@小迷弟+“点歌”+歌名即可点歌'
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*105$/,
    message () {
      return '【帮@所有人】@小迷弟+“@所有人”即可帮你@全部成员啦'
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*250$/,
    message () {
      return '亲，洗洗睡吧，没有更多功能了啦Σ(*ﾟдﾟﾉ)ﾉ'
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*@\s?所有人$/,
    message (msg, context) {
      return `[CQ:at,qq=all] 叮咚！${context.sender.nickname}有事找你们，看到请回一下呢。`
    }
  }
]

module.exports = chatMsg
