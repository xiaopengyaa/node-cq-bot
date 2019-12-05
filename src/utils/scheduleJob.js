const schedule = require('node-schedule')

// 封装定时任务
const scheduleJob = {
  // 开启定时任务
  start (app = {}, scheduleList = [], cb) {
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
  // 取消定时任务
  cancel (app = {}, scheduleList = []) {
    scheduleList.forEach(item => {
      app[item.name] && schedule.cancelJob(item.name)
    })
  }
}

module.exports = scheduleJob