const { CQWebSocket } = require('cq-websocket')
const bot = new CQWebSocket()
const getNews = require('./src/js/schedule/news')

// ws链接监听
bot
  .on('socket.connecting', (socketType, attempts) => console.log(`[${socketType}]第${attempts}次连接中...`))
  .on('socket.connect', (socketType, sock, attempts) => console.log(`[${socketType}]第${attempts}次连接成功`))
  .on('socket.failed', (socketType, attempts) => console.log(`[${socketType}]第${attempts}次连接失败`))
  .on('socket.error', console.error)
  .on('api.response', res => console.log('推送消息：', res.status))
  .on('socket.close', () => console.log('socket链接关闭'))
  .once('ready', () => console.log('你的小可爱上线啦ヽ(*´∀`)ﾉ'))

// bot消息监听
bot.on('message', (e, context) => {
  console.log('监听消息：', context)
  return context.message
})

// 开始执行（放最后）
bot.connect()

getNews()