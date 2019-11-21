const fs = require('fs')
const path = require('path')
const moment = require("moment")
const cheerio = require('cheerio')
const iconvLite = require('iconv-lite')
const { api } = require('./index')
let baseUrl = 'http://www.jokeji.cn'
let url = '/jokehtml/mj/2019111415401696.htm'
let nextStartUrl = '/JokeHtml/xy/2018092520195359.htm'
let page = 1 // 初始页面数
let jokeObj = {} // 格式为 {date: [text]}
let size = 5 // 每天存5条
let day = 0 // 初始天数
let totalDays = 365 // 爬取365天的数据
let jokeNum = 0 // 笑话数目

// 获取笑话
async function getJoke (url) {
  console.log(`正在爬取第${page}页的数据...`)
  const data = await api.get(url, null, { responseType: 'arraybuffer' })
  const html = iconvLite.decode(data, 'gbk')
  const $ = cheerio.load(html)
  let date = moment().add(day, 'days').format('YYYY-MM-DD')
  $('#text110 p').each((index, elem) => {
    const text = $(elem).text().replace(/^\d{1,2}、/, '') // 去掉序号
    console.log('笑话数目：', ++jokeNum)
    // 写入数据
    if (!jokeObj[date]) { 
      jokeObj[date] = [text]
    } else if (jokeObj[date] && jokeObj[date].length < size) {
      jokeObj[date].push(text)
    } else {
      day++
      date = moment().add(day, 'days').format('YYYY-MM-DD')
      jokeObj[date] = [text]
    }
  })
  const nextUrl = $('.zw_page1 a').attr('href').replace('../..', '')
  console.log('下一页url：', baseUrl + nextUrl)
  // 递归
  if (day < totalDays && nextUrl) {
    page++
    getJoke(encodeURI(baseUrl + nextUrl))
  } else {
    // 写入数据
    fs.writeFileSync(path.join(__dirname, '../json/joke.json'), JSON.stringify(jokeObj))
  }
}
getJoke(encodeURI(baseUrl + url))
