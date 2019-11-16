const { getWeatherMsg } = require('./weather')

const list = {
  // 群验证列表
  groupReplyList: [
    {
      rule: /^\[CQ:at,qq=\d+\]([\s\S]*)天气$/,
      message: getWeatherMsg
    }
  ]
}

const reply = {
  // 群验证回复消息
  async groupReplyMsg(msg) {
    const result = []
    for (let i = 0; i < list.groupReplyList.length; i++) {
      // 校验rule
      const item = list.groupReplyList[i]
      if (item.rule.test(msg)) {
        const matchInfo = RegExp.$1.trim()
        console.log('匹配信息:', matchInfo)
        const message = await item.message(matchInfo)
        result.push(message)
      }
    }
    return result
  }
}

module.exports = reply