const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./config.json'))
const { CQWebSocket } = require('cq-websocket')
const bot = new CQWebSocket(config.options || {})
const scheduleJob = require('./src/js/schedule')
const { groupReplyMsg } = require('./src/js/reply')

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
    scheduleJob.cancel()
  })
  .on('ready', () => {
    console.log('你的小可爱上线啦ヽ(*´∀`)ﾉ')
    // 定时任务开始
    scheduleJob.start(list => {
      list.forEach(msg => {
        // 发送群推送
        bot('send_group_msg', {
          group_id: config.base.groupId,
          message: [msg]
        })
          .then(console.log)
          .catch(console.error)
      })
    })
  })

// bot消息监听
bot.on('message.private', async (e, context) => {
  console.log('监听消息：', context)
  return context.message
})
bot.on('message.group.@.me', async (e, context) => {
  console.log('监听消息：', context)
  // 获取群验证回复消息
  const list = await groupReplyMsg(context.message)
  console.log('list-msg:', list)
  if (list && list.length > 0) {
    list.forEach(msg => {
      // 发送群推送
      console.log('群回复ing...')
      bot('send_group_msg', {
        group_id: context.group_id,
        message: [msg]
      })
        .then(console.log)
        .catch(console.error)
    })
  } else {
    return ['@我干嘛呀Σ(*ﾟдﾟﾉ)ﾉ']
  }
})

// 开始执行（放最后）
bot.connect()