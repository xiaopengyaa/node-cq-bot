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
    rule: '0 0 12 * * *', // 每天中午12点
    func: getMatch
  }
]

module.exports = scheduleList