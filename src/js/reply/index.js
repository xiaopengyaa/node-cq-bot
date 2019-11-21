const weatherMsg = require('./weather')
const chatMsg = require('./chat')
const songMsg = require('./song')
const jokeMsg = require('./joke')

const list = {
  // 群验证列表: [{ rule, message }]
  groupReplyList: [
    weatherMsg,
    ...chatMsg,
    ...songMsg,
    ...jokeMsg
  ]
}

const reply = {
  // 群验证回复消息
  async groupReplyMsg(app = {}, context) {
    const result = []
    for (let i = 0; i < list.groupReplyList.length; i++) {
      const item = list.groupReplyList[i]
      // 判断是否开启、校验rule
      if (app[item.name] && item.rule.test(context.message)) {
        const matchInfo = RegExp.$1.trim()
        console.log('匹配信息:', matchInfo)
        const message = await item.message(matchInfo, context)
        result.push(message)
      }
    }
    return result
  }
}

module.exports = reply