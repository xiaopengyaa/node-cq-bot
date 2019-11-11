const schedule = require('node-schedule')
const { getNews } = require('./news')
const { getOneList } = require('./one')

// 定时任务名字
const scheduleName = {
  news: 'news',
  one: 'one'
}
// 定时任务
const scheduleObj = {
  [scheduleName.news]: {
    rule: '0 0 * * * *', // 1 time/h
    func: getNews
  },
  [scheduleName.one]: {
    rule: '0 0 8 * * *', // 每天早上8点
    func: getOneList
  }
}
// 初始化定时任务
const scheduleJob = {
  start (cb) {
    Object.entries(scheduleObj).forEach(item => {
      const [name, job] = item
      schedule.scheduleJob(name, job.rule, async () => {
        const data = await job.func()
        cb && cb(data)
      })
    })
  },
  cancel () {
    Object.keys(scheduleName).forEach(name => {
      schedule.cancelJob(name)
    })
  }
}

module.exports = scheduleJob