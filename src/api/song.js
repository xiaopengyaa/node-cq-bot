const puppeteerResolver = require('puppeteer-chromium-resolver')
const { api } = require('../utils')

const url = {
  songList163(param, type = '1') {
    return `https://music.163.com/#/search/m/?s=${encodeURIComponent(param)}&${type}`
  },
  songListQQ: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
}

const song = {
  // 网易云163歌曲
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
  // QQ音乐
  async getSongListQQ(song) {
    const reqData = {
      g_tk: 5381,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      w: song,
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
      remoteplace: 'txt.mqq.all'
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
