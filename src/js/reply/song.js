const { song } = require('../../api')
const { decrypMusic } = require('../../utils')

const notFoundMsg = '叮！歌曲搜索不到Σ(*ﾟдﾟﾉ)ﾉ'
const tipsMsg = '亲，请输入需要点歌的歌名'

let temSongList = [] // 临时歌曲列表
let rankTypeList = null // 排行榜类型

const songMsg = [
  {
    name: 'song',
    rule: /^\[CQ:at,qq=\d+\]\s*点歌([\s\S]*)/,
    async message (msg) {
      if (!msg) return tipsMsg
      const res = await song.getSong163({
        s: msg
      })
      let data = null
      if (res.code !== 200) return notFoundMsg
      if (res.abroad) {
        // 搜索url解密key为'fuck~#$%^&*(458'
        const key = 'fuck~#$%^&*(458'
        data = JSON.parse(decodeURIComponent(decrypMusic(res.result, key)))
      } else {
        data = res.result
      }
      return data.songCount > 0 ? `[CQ:music,id=${data.songs[0].id},type=163]` : notFoundMsg
    }
  },
  {
    name: 'song',
    rule: /^\[CQ:at,qq=\d+\]\s*排行榜([\s\S]*)/,
    async message (msg) {
      let text = ''
      !rankTypeList && (rankTypeList = await song.getRankType163())
      if (!msg) {
        text = '排行榜类型有：\r\n\r\n'
        rankTypeList.slice(0, 10).forEach((item, index) => {
          text += `【${index + 1}】${item.name}\r\n`
        })
        text += '\r\n@小迷弟+“排行榜”+排行榜类型即可查看榜单歌曲（PS：排行榜类型支持模糊匹配）'
      } else {
        for (item of rankTypeList) {
          if (item.name.includes(msg)) {
            text = `以下为${item.name}歌曲列表：\r\n\r\n`
            temSongList = await song.getRankList163({ id: item.id })
            temSongList = temSongList.slice(0, 10)
            temSongList.forEach((song, index) => {
              text += `【${index + 1}】${song.name}\r\n`
            })
            text += '\r\n@小迷弟+编号即可点歌'
            break
          }       
        }
      }
      return text
    }
  },
  {
    name: 'song',
    rule: /^\[CQ:at,qq=\d+\]\s*(\d{1,2})$/, // 编号点歌
    message (msg) {
      let text = ''
      if (temSongList.length > 0 && temSongList[msg - 1]) {
        text = `[CQ:music,id=${temSongList[msg - 1].id},type=163]`
      }
      return text
    }
  },
  // {
  //   name: 'song',
  //   rule: /^\[CQ:at,qq=\d+\]\s*网易云点歌([\s\S]*)/,
  //   async message (msg) {
  //     if (!msg) return tipsMsg
  //     const songId = await song.getSongId163(msg)
  //     return songId ? `[CQ:music,id=${songId},type=163]` : notFoundMsg
  //   }
  // },
  {
    name: 'song',
    rule: /^\[CQ:at,qq=\d+\]\s*[qQ]{2}点歌([\s\S]*)/,
    async message (msg) {
      if (!msg) return tipsMsg
      const res = await song.getSongListQQ({
        w: msg
      })
      const list = res.code === 0 && res.data.song.list || []
      return list && list.length > 0 ? `[CQ:music,id=${list[0].songid},type=qq]` : notFoundMsg
    }
  }
]

module.exports = songMsg