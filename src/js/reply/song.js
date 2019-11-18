const { song } = require('../../api')
const { cqMsg, decrypMusic } = require('../../utils')

const notFoundMsg = cqMsg('叮！歌曲搜索不到Σ(*ﾟдﾟﾉ)ﾉ')
const tipsMsg = cqMsg('亲，请输入需要点歌的歌名')

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
        console.log('网易云abroad：', res.result)
        data = JSON.parse(decodeURIComponent(decrypMusic(res.result, key)))
      } else {
        data = res.result
      }
      if (data.songCount > 0) {
        return {
          type: 'music',
          data: {
            type: '163',
            id: data.songs[0].id
          }
        }
      } else {
        return notFoundMsg
      }
    }
  },
  // {
  //   name: 'song',
  //   rule: /^\[CQ:at,qq=\d+\]\s*点歌([\s\S]*)/,
  //   async message (msg) {
  //     if (!msg) return tipsMsg
  //     const songId = await song.getSongId163(msg)
  //     if (songId) {
  //       return {
  //         type: 'music',
  //         data: {
  //           type: '163',
  //           id: songId
  //         }
  //       }
  //     } else {
  //       return notFoundMsg
  //     }
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
      if (list && list.length > 0) {
        return {
          type: 'music',
          data: {
            type: 'qq',
            id: list[0].songid
          }
        }
      } else {
        return notFoundMsg
      }
    }
  }
]
module.exports = songMsg