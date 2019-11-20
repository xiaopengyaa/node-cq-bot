const fs = require('fs')
const moment = require('moment')
const config = JSON.parse(fs.readFileSync('./config.json'))
const announcement = JSON.parse(fs.readFileSync('./src/json/announcement.json'))
const { CQWebSocket } = require('cq-websocket')
const bot = new CQWebSocket(config.options || {})
const scheduleJob = require('./src/js/schedule')
const { groupReplyMsg } = require('./src/js/reply')
const { random } = require('./src/utils')

// ws链接监听
bot
  .on('socket.connecting', (socketType, attempts) => console.log(`[${socketType}]第${attempts}次连接中...`))
  .on('socket.connect', (socketType, sock, attempts) => console.log(`[${socketType}]第${attempts}次连接成功`))
  .on('socket.failed', (socketType, attempts) => console.log(`[${socketType}]第${attempts}次连接失败`))
  .on('socket.error', console.error)
  .on('api.response', res => console.log('推送消息：', res.status))
  .on('socket.close', () => {
    console.log('socket链接关闭')
    // 定时任务关闭
    scheduleJob.cancel(config.application)
  })
  .on('ready', () => {
    console.log('你的小可爱上线啦ヽ(*´∀`)ﾉ')
    // 定时任务开始
    scheduleJob.start(config.application, list => {
      list.forEach(msg => {
        // 发送群推送
        if (config.base && config.base.groupIdList) {
          config.base.groupIdList.forEach(groupId => {
            console.log(`群消息【${groupId}】推送中...`)
            bot('send_group_msg', {
              group_id: groupId,
              message: msg
            })
              .then(console.log)
              .catch(console.error)
          })
        }
      })
    })
    // 发送公告
    const today = moment().format('YYYY-MM-DD')
    if (announcement[today] && !announcement[today].release) {
      const { title, content } = announcement[today]
      const msg = `${title}\r\n\r\n${content}`
      if (config.base && config.base.groupIdList) {
        config.base.groupIdList.forEach(groupId => {
          console.log(`群公告【${groupId}】推送中...`)
          bot('send_group_msg', {
            group_id: groupId,
            message: msg
          })
            .then(res => {
              console.log(res)
              if (res.retcode === 0) {
                // 更新状态
                announcement[today].release = true
                fs.writeFileSync('./src/json/announcement.json', JSON.stringify(announcement))
              }
            })
            .catch(console.error)
        })
      }
    }
  })

// bot消息监听
bot.on('message.private', async (e, context) => {
  console.log('监听消息：', context)
  return context.message
})
bot.on('message.group.@.me', async (e, context) => {
  console.log('监听消息：', context)
  // 获取群验证回复消息
  const list = await groupReplyMsg(config.application, context)
  console.log('list-msg:', list)
  if (list && list.length > 0) {
    list.forEach(msg => {
      // 发送群推送
      console.log('群回复ing...')
      bot('send_group_msg', {
        group_id: context.group_id,
        message: msg
      })
        .then(console.log)
        .catch(console.error)
    })
  } else {
    const msgArr = config.base.randomReplyMsg || ['@我干嘛呀Σ(*ﾟдﾟﾉ)ﾉ']
    return msgArr[random(0, msgArr.length - 1)]
  }
})

// 开始执行（放最后）
bot.connect()