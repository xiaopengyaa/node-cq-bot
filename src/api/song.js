const qs = require('querystring')
const puppeteerResolver = require('puppeteer-chromium-resolver')
const { api, getEncryptObj } = require('../utils')

const url = {
  songList163(param, type = '1') {
    return `https://music.163.com/#/search/m/?s=${encodeURIComponent(param)}&${type}`
  },
  song163: 'https://music.163.com/weapi/cloudsearch/get/web',
  songSort163: 'https://music.163.com/discover/toplist',
  songListQQ: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
}

const song = {
  // 网易云163歌曲（api的方式）
  async getSong163 (param = {}) {
    const reqData = {
      limit: '20',
      offset: '0',
      total: 'true',
      type: '1',
      ...param
    }
    const encryptData = getEncryptObj(reqData)
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://music.163.com/search/'
      }
    }
    const res = await api.post(url.song163, qs.stringify(encryptData), config)
    return res
  },
  // 网易云163歌曲（爬虫的方式）
  async getSongId163(param) {
    // 初始化puppeteer
    const revisionInfo = await puppeteerResolver({
      revision: '',
      detectionPath: '',
      folderName: '.chromium-browser-snapshots',
      hosts: [
        'https://storage.googleapis.com',
        'https://npm.taobao.org/mirrors'
      ],
      retry: 3
    })
    // 创建浏览器
    const browser = await revisionInfo.puppeteer
      .launch({
        headless: true,
        args: ['--no-sandbox'],
        executablePath: revisionInfo.executablePath
      })
      .catch(err => {
        console.log(err)
      })

    const page = await browser.newPage()
    await page.goto(url.songList163(param))
    // 获取歌曲的iframe
    const iframe = await page.frames().find(f => f.name() === 'contentFrame')
    const songId = await iframe.evaluate(() => {
      const elem = document.querySelector('.item a')
      return elem ? elem.getAttribute('data-res-id') : ''
    })
    // 关闭浏览器
    await browser.close()
    return songId
  },
  // 网易云歌曲排行榜歌曲
  async getRankList163 (param) {
    const html = await api.get(url.songSort163, param)
    const reg = /<li><a href="\/song\?id=(\d+)">([^<]+)<\/a><\/li>/g // 获取排行榜歌曲id和名字
    let songIdList = []
    let match = null
    while((match = reg.exec(html)) !== null) {
      songIdList.push({
        id: match[1],
        name: match[2]
      })
    }
    return songIdList
  },
  // 网易云歌曲排行榜类型
  async getRankType163 () {
    const html = await api.get(url.songSort163)
    const reg = /<a href="\/discover\/toplist\?id=(\d+)" class="s-fc0">([^<]+)<\/a>/g // 获取排行榜类型
    let rankTypeList = []
    let match = null
    while((match = reg.exec(html)) !== null) {
      rankTypeList.push({
        id: match[1],
        name: match[2]
      })
    }
    return rankTypeList
  },
  // QQ音乐
  async getSongListQQ(param = {}) {
    const reqData = {
      g_tk: 5381,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      zhidaqu: 1,
      catZhida: 1,
      t: 0,
      flag: 1,
      ie: 'utf-8',
      sem: 1,
      aggr: 0,
      perpage: 20,
      n: 20,
      p: 1,
      remoteplace: 'txt.mqq.all',
      ...param
    }
    const config = {
      headers: {
        Referer: 'https://y.qq.com/m/index.html'
      }
    }
    const res = await api.get(url.songListQQ, reqData, config)
    return res
  }
}

module.exports = song
