const weatherMsg = require('./weather')
const chatMsg = require('./chat')
const songMsg = require('./song')

const list = {
  // 群验证列表: [{ rule, message }]
  groupReplyList: [
    weatherMsg,
    ...chatMsg,
    ...songMsg
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