const moment = require('moment')
const { ticketApi } = require('../../../api')
const { scheduleJob } = require('../../../utils')
const validation = require('./validation')

let ticketMap = {} // 临时查询任务数据

const ticketMsg = [
  {
    name: 'ticket',
    rule: /^\[CQ:at,qq=\d+\]\s*火车票查询$/,
    message () {
      let text = `温馨提示：

1、@小迷弟+“火车票查询” + 出发地点 + 目的地点 + 出发日期 + 车次信息（不填默认为全部） + 座位类型（不填默认为全部）即可实时查询火车票余票信息（PS：各项信息需以空格隔开）

2、查询成功小迷弟会实时@你哟或者@小迷弟+“火车票查询结果”即可查看你的相关火车票查询任务信息

3、@小迷弟+“107”可以查看火车票查询的具体功能详情`
      return text
    }
  },
  {
    name: 'ticket',
    rule: /^\[CQ:at,qq=\d+\]\s*火车票查询\s([\s\S]*)$/,
    async message (msg, context) {
      let text = ''
      if (msg) {
        let ticketInfo = msg.split(' ') // 空格隔开
        let ticketData = {}
        let flag = true 
        for (let i = 0; i < validation.length; i++) {
          if (!validation[i].validate(ticketInfo[i])) {
            text = validation[i].message
            flag = false
            break
          } else {
            ticketData[validation[i].name] = ticketInfo[i] === '全部' ? '' : ticketInfo[i]
          }
        }
        console.log(ticketData)
        // 信息验证成功则开启定时查询
        if (flag) {
          let name = `ticket_${context.sender.user_id}`
          let ruleItem = {
            name,
            rule: '*/5 * * * * *', // 每5秒一次
            async func () {
              return await getScheduleTicketMsg(ticketData, name)
            }
          }
          text = '正在为你查询，如果查询到有余票的话到时会直接@你哟'
          ticketMap[name] = {
            count: 0,
            task: `【${msg}】查询任务`
          }
          scheduleJob.cancel(name) // 多次查询先取消已有定时任务
          scheduleJob.start(ruleItem, info => {
            if (info) {
              bot('send_group_msg', {
                group_id: context.group_id,
                message: `[CQ:at,qq=${context.user_id}] 亲，已经为你查询到车票啦\r\n\r\n${info}`
              })
            }
          })
        }
      }
      return text
    }
  },
  {
    name: 'ticket',
    rule: /^\[CQ:at,qq=\d+\]\s*火车票查询结果$/,
    message (msg, context) {
      let text = ''
      let name = `ticket_${context.sender.user_id}`
      if (ticketMap[name]) {
        text = `${ticketMap[name].task}\r\n\r\n亲，已为你实时查询${ticketMap[name].count}次了哟，暂时还没有票呢，请耐心等候。`
      } else {
        text = '亲，没有你的相关火车票查询任务啦。温馨提示：@小迷弟+“107”可以查看火车票查询的具体功能哟'
      }
      return text
    }
  },
  {
    name: 'ticket',
    rule: /^\[CQ:at,qq=\d+\]\s*火车票查询取消$/,
    message (msg, context) {
      let text = ''
      let name = `ticket_${context.sender.user_id}`
      if (ticketMap[name]) {
        text = `${ticketMap[name].task}取消成功`
        // 取消定时任务
        scheduleJob.cancel(name)
        delete ticketMap[name]
      } else {
        text = '取消不了哟，因为没有你的相关火车票查询任务信息。温馨提示：@小迷弟+“107”可以查看火车票查询的具体功能哟'
      }
      return text
    }
  }
]

// 火车票定时查询信息
async function getScheduleTicketMsg ({ DepartStation, ArriveStation, DepartDate, TrainName = '', SeatType = '' }, name) {
  const data = await ticketApi.getTicket({
    DepartStation,
    ArriveStation,
    DepartDate
  })
  ticketMap[name] && ticketMap[name].count++
  const list = data.ResponseBody.TrainItems || []
  let hasTicket = false
  let desp = `以下为${moment(DepartDate).format('YYYY年MM月DD日')} ${TrainName} ${DepartStation}至${ArriveStation}的${SeatType}有票车次：` // 消息内容
  list.forEach(item => {
    // 车次信息判断
    if (TrainName && !TrainName.toLowerCase().includes(item.TrainName.toLowerCase())) return
    // 是否可预订
    if (item.Bookable) {
      let showTitle = true
      item.TicketResult.TicketItems.forEach(ticket => {
        // 余票及座位类型判断
        if (ticket.Inventory > 0 && (!SeatType || SeatType.includes(ticket.SeatTypeName))) {
          if (showTitle) {
            desp += `\r\n\r\n${moment(DepartDate).format('MM月DD日')} ${item.StartTime} ${item.TrainName}：\r\n`
          }
          desp += `${ticket.SeatTypeName}：${ticket.Inventory}，`
          hasTicket = true
          showTitle = false
        }
      })
      // 去掉最后的逗号
      desp.charAt(desp.length - 1) === '，' && (desp = desp.slice(0, -1))
    }
  })
  if (hasTicket) {
    // 取消定时任务
    scheduleJob.cancel(name)
    delete ticketMap[name]
    return desp
  } else {
    console.log(`${name}第${ticketMap[name].count}次查询：没票`)
  }
}
// ticketMsg[0].message('广州南 江门东 2019-12-08 全部 二等座')
module.exports = ticketMsg