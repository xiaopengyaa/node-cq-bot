const moment = require('moment')
const fs = require('fs')
const { wzry } = require('../../api')

const getNews = async () => {
  const announcementList = await wzry.getWzryNews({ id: 1762 }) // 获取公告list
  const activityList = await wzry.getWzryNews({ id: 1763 }) // 获取活动list
  return dealNews(announcementList, activityList)
}

function dealNews(...news) {
  const baseUrl = 'https://pvp.qq.com/m/m201606/newCont.shtml?newCont.shtml?G_Biz=18&tid='
  let result = []
  let newsObj = null
  try {
    newsObj = JSON.parse(fs.readFileSync('./news.json'))
  } catch (e) {
    newsObj = {}
  }
  news.forEach(list => {
    list.forEach(item => {
      const today = moment().format('YYYY-MM-DD')
      const createdDate = moment(item.sCreated).format('YYYY-MM-DD')
      const diff = moment().diff(item.sCreated, 'days')
      console.log(createdDate, today, diff)
      // 判断2天内的文章是否已发
      if (diff <= 2 && !newsObj[item.iNewsId]) {
        const title = `【${item.sAuthor}】${item.sTitle}`
        const url = baseUrl + item.iNewsId
        result.push({
          title,
          url
        })
        newsObj[item.iNewsId] = title
        fs.writeFileSync('./news.json', JSON.stringify(newsObj))
      }
    })
  })
  console.log(result)
  return result
}

module.exports = getNews