const { song } = require('../../api')
const { decrypMusic } = require('../../utils')

const notFoundMsg = '叮！歌曲搜索不到Σ(*ﾟдﾟﾉ)ﾉ'
const tipsMsg = '亲，请输入需要点歌的歌名'

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