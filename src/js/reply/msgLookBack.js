const sqlite3 = require('sqlite3').verbose()
const moment = require('moment')
const fs = require('fs')
const path = require('path')

const lookBackMsg = [
  {
    name: 'msgLookBack',
    rule: /^\[CQ:at,qq=\d+\]\s*消息回看([\s\S]*)/,
    async message (msg, context) {
      // 暂时设为群主专用
      if (context.sender.role !== 'owner') return '亲，消息回看功能暂时为群主专属功能'
      let text = ''
      if (!msg) {
        text = '@小迷弟+“消息回看”+qq号+消息序号即可回看消息（各字段需以空格隔开）'
      } else {
        const list = await getDatabaseList(context.self_id)
        const reg = /^群:\s(\d+)\s帐号:\s(\d+)\s[\r\n]*([\s\S]*)/
        let [searchQQ, count = 1] = msg.split(' ')
        let searchTime = ''
        let targetName = ''
        // 查找对应消息
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (item.priority !== 12 || !reg.exec(item.detail)) continue
          const [, groupId, targetQQ, message] = reg.exec(item.detail)
          if (groupId == context.group_id && targetQQ.includes(searchQQ)) {
            count--
          }
          if (count === 0) {
            text = message
            const res = await bot('get_group_member_info', {
              group_id: groupId,
              user_id: targetQQ
            })
            res.retcode === 0 && (targetName = res.data.card || res.data.nickname)
            console.log('targetName:', targetName)
            searchTime = item.time.toString().padEnd(13, '0') // 时间补全
            break
          }
        }
        if (text) {
          const title = `${targetName} ${moment(Number(searchTime)).format('MM月DD日 HH:mm')}`
          // const messageType = ['CQ:music', 'CQ:share', 'CQ:rich']
          text = `${title}\r\n--------------------\r\n${text}`
        } else {
          text = '亲，找不到呀~'
        }
      }
      return text
    }
  }
]

// 查找数据库信息
function getDatabaseList (qq) {
  const filePath = path.join(config.base.dataPath, `data/${qq}/logv2_${moment().format('YYYYMM')}.db`)
  const isExitFile = fs.existsSync(filePath)
  return new Promise(resolve => {
    if (isExitFile) {
      const db = new sqlite3.Database(filePath)
      const sql = 'SELECT * FROM log ORDER BY time DESC LIMIT 50'
      db.all(sql, (err, rows) => {
        if(!err) {
          db.close()
          resolve(rows)
        }
      })
    } else {
      resolve([])
    }
  })
}
module.exports = lookBackMsg