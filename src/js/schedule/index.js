const schedule = require('node-schedule')
const { getNews } = require('./wzryNews')
const { getOneList } = require('./one')

// 定时任务
const scheduleList = [
  {
    name: 'wzry',
    rule: '0 0 * * * *', // 1 time/h
    func: getNews
  },
  {
    name: 'one',
    rule: '0 0 8 * * *', // 每天早上8点
    func: getOneList
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