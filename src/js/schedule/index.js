const schedule = require('node-schedule')
const { getNews, getMatch } = require('./wzryNews')
const { getOneList } = require('./one')

// 定时任务
const scheduleList = [
  {
    name: 'wzry',
    rule: '0 */10 * * * *', // 每10分钟一次
    func: getNews
  },
  {
    name: 'one',
    rule: '0 0 8 * * *', // 每天早上8点
    func: getOneList
  },
  {
    name: 'match',
    rule: '0 0 12 * * * *', // 每天中午12点
    func: getMatch
  }
]
// 初始化定时任务
const scheduleJob = {
  start (app = {}, cb) {
    scheduleList.forEach(item => {
      // 判断是否有开启定时任务
      app[item.name] && schedule.scheduleJob(item.name, item.rule, async () => {
        if (typeof cb === 'function') {
          const data = await item.func()
          cb(data)
        }
      })
    })
  },
  cancel (app = {}) {
    scheduleList.forEach(item => {
      app[item.name] && schedule.cancelJob(item.name)
    })
  }
}

module.exports = scheduleJob