const moment = require('moment')
const fs = require('fs')
const cheerio = require('cheerio')
const { wzry } = require('../../api')

const image = 'http://qpic.cn/lwp36hZly' // 群主推送image
let newsObj = null

// 读取已发送文章json
try {
  newsObj = JSON.parse(fs.readFileSync('./news.json'))
} catch (e) {
  newsObj = {}
}

const news = {
  async getNews() {
    const announcementList = await wzry.getWzryNews({ id: 1762 }) // 获取公告list
    const activityList = await wzry.getWzryNews({ id: 1763 }) // 获取活动list
    const newsList = dealNews(announcementList.concat(activityList)) // 定时消息list
    const newInfoList = await dealNewInfo() // 定时消息list
    return newsList.concat(newInfoList)
  }
}

// 处理公告、活动数据
function dealNews(news) {
  const baseUrl = 'https://pvp.qq.com/m/m201606/newCont.shtml?newCont.shtml?G_Biz=18&tid='
  let result = []
  news.forEach(item => {
    const diff = moment().diff(item.sCreated, 'days')
    // 判断2天内的文章是否已发
    if (diff <= 2 && !newsObj[item.iNewsId]) {
      const title = `【${item.sAuthor}】${item.sTitle}`
      const url = baseUrl + item.iNewsId
      result.push({
        type: 'share',
        data: {
          url,
          title: item.sAuthor,
          content: item.sTitle,
          image
        }
      })
      newsObj[item.iNewsId] = title
      fs.writeFileSync('./news.json', JSON.stringify(newsObj))
    }
  })
  return result
}

// 处理王者爆料站信息
async function dealNewInfo() {
  const html = await wzry.getWzryNewInfo()
  const $ = cheerio.load(html)
  const $a = $('.news-list li a').eq(0)
  const url = `https://pvp.qq.com${$a.attr('href')}`
  const label = $a.find('i').text()
  const title = $a.find('b').text()
  const date = $a.find('span').text()
  const diff = moment().diff(date, 'days')
  let result = []
  // 判断2天内的文章是否已发
  if (diff <= 2 && !newsObj[date]) {
    result.push({
      type: 'share',
      data: {
        url,
        title: '王者荣耀爆料站',
        content: `【${label}】${title}`,
        image
      }
    })
    newsObj[date] = `【王者荣耀爆料站】${title}`
    fs.writeFileSync('./news.json', JSON.stringify(newsObj))
  }
  return result
}

module.exports = news