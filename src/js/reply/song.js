const { song } = require('../../api')
const { cqMsg } = require('../../utils')

const songMsg = [
  {
    name: 'song',
    rule: /^\[CQ:at,qq=\d+\]\s*点歌([\s\S]*)/,
    async message (msg) {
      if (!msg) return cqMsg('亲，请输入需要点歌的歌名')
      const res = await song.getSong163({
        s: msg
      })
      console.log('网易云点歌：', res)
      if (res.code === 200 && res.result.songCount > 0) {
        const songId = res.result.songs[0].id
        return {
          type: 'music',
          data: {
            type: '163',
            id: songId
          }
        }
      } else {
        return cqMsg('叮！歌曲搜索不到Σ(*ﾟдﾟﾉ)ﾉ')
      }
    }
  },
  // {
  //   name: 'song',
  //   rule: /^\[CQ:at,qq=\d+\]\s*点歌([\s\S]*)/,
  //   async message (msg) {
  //     if (!msg) return cqMsg('亲，请输入需要点歌的歌名')
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
  //       return cqMsg('叮！歌曲搜索不到Σ(*ﾟдﾟﾉ)ﾉ')
  //     }
  //   }
  // },
  {
    name: 'song',
    rule: /^\[CQ:at,qq=\d+\]\s*[qQ]{2}点歌([\s\S]*)/,
    async message (msg) {
      if (!msg) return cqMsg('亲，请输入需要点歌的歌名')
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
        return cqMsg('叮！歌曲搜索不到Σ(*ﾟдﾟﾉ)ﾉ')
      }
    }
  }
]
module.exports = songMsg