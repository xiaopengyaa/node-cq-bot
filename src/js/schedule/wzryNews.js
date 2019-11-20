const moment = require('moment')
const fs = require('fs')
const cheerio = require('cheerio')
const { wzry } = require('../../api')

const image = 'http://qpic.cn/lwp36hZly' // 群主推送image
let newsObj = null

// 读取已发送文章json
try {
  newsObj = JSON.parse(fs.readFileSync('./src/json/news.json'))
} catch (e) {
  newsObj = {}
}

const news = {
  // 获取公告、活动、爆料站信息
  async getNews() {
    const announcementList = await wzry.getWzryNews({ id: 1762 }) // 获取公告list
    const activityList = await wzry.getWzryNews({ id: 1763 }) // 获取活动list
    const newsList = dealNews(announcementList.concat(activityList)) // 定时消息list
    const newInfoList = await dealNewInfo() // 定时消息list
    return newsList.concat(newInfoList)
  },
  // 获取当天比赛信息
  async getMatch () {
    const today = moment().format('YYYY-MM-DD')
    const begin_time = Date.parse(today) / 1000
    const end_time = Date.parse(moment().add(1, 'days').format('YYYY-MM-DD')) / 1000
    const season = moment().format('MM') > 6 ? 'S2' : 'S1'
    const seasonid = `KPL${moment().format('YYYY')}${season}`
    const matchList = await wzry.getWzryMatch({
      begin_time,
      end_time,
      seasonid
    })
    let result = []
    let title = ''
    let content = ''
    let index = 0
    matchList.forEach(item => {
      title = `今日份【${item.season}】比赛信息`
      if (today === moment(item.match_time).format('YYYY-MM-DD')) {
        index++
        content += `${index}、${item.hname} vs ${item.gname}\r\n 比赛时间：${moment(item.match_time).format('MM月DD日 HH:mm')}\r\n\r\n`
      }
    })
    if (content) {
      result.push(`${title}\r\n\r\n${content}有兴趣的到时可以去看看哈[CQ:face,id=13]`)
    }
    return result
  }
}

// 处理公告、活动数据
function dealNews(news) {
  const baseUrl = 'https://pvp.qq.com/m/m201606/newCont.shtml?newCont.shtml?G_Biz=18&tid='
  let result = []
  news.forEach(item => {
    const diff = moment().diff(item.sCreated, 'days')
    // 判断1天内的文章是否已发
    if (diff <= 1 && !newsObj[item.iNewsId]) {
      const title = `【${item.sAuthor}】${item.sTitle}`
      const url = baseUrl + item.iNewsId
      result.push([{
        type: 'share',
        data: {
          url,
          title: item.sAuthor,
          content: item.sTitle,
          image
        }
      }])
      newsObj[item.iNewsId] = title
      fs.writeFileSync('./src/json/news.json', JSON.stringify(newsObj))
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
  // 判断1天内的文章是否已发
  if (diff <= 1 && !newsObj[date]) {
    result.push([{
      type: 'share',
      data: {
        url,
        title: '王者荣耀爆料站',
        content: `【${label}】${title}`,
        image
      }
    }])
    newsObj[date] = `【王者荣耀爆料站】${title}`
    fs.writeFileSync('./src/json/news.json', JSON.stringify(newsObj))
  }
  return result
}

module.exports = news