const { CQWebSocket } = require('cq-websocket')
const bot = new CQWebSocket()
const scheduleJob = require('./src/js/schedule')
const groupId = 623084193
const userId = 857763476

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
          group_id: groupId,
          message: [msg]
        })
          .then(console.log)
          .catch(console.error)
        // 发送私聊推送
        // bot('send_private_msg', {
        //   user_id: userId,
        //   message: [msg]
        // })
        //   .then(console.log)
        //   .catch(console.error)
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
  return ['@我干嘛呀Σ(*ﾟдﾟﾉ)ﾉ']
})

// 开始执行（放最后）
bot.connect()