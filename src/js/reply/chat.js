// 自动聊天回复
const chatMsg = [
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*功能$/,
    message () {
      const text = `现有功能：

【101】王者荣耀

【102】查看天气

【103】每日一句

【104】听音乐

【105】帮@所有人

【106】每日笑话

【107】火车票查询

【108】每日星座运势

【109】给头像戴上圣诞帽

【110】消息回看

【250】查看更多功能

@小迷弟+编号可以获取功能详情`
      return text
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*101$/,
    message () {
      return `【王者荣耀】

1、小迷弟会把王者荣耀每天最新的公告、活动、比赛信息、新英雄、新皮肤等资讯推送给大家哟

2、@小迷弟+英雄名字+“出装”即可查看当前英雄的推荐出装

3、@小迷弟+英雄名字+“铭文”即可查看当前英雄的推荐铭文

4、推荐的出装和铭文均来自王者荣耀官方，仅供参考哈`
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*102$/,
    message () {
      return '【查看天气】@小迷弟+地方名+“天气”即可查看当天的天气哟。PS：地方名不能带 “市” “区” 等字眼哟。'
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*103$/,
    message () {
      return '【每日一句】每天早上8点都会有一份鸡汤，让您精神满满，嘿嘿'
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*104$/,
    message () {
      return `【听音乐】
      
1、@小迷弟+“点歌”+歌名即可点歌

2、@小迷弟+“排行榜”即可查看排行榜类型
      
3、@小迷弟+“排行榜”+排行榜类型即可查看榜单歌曲（PS：排行榜类型支持模糊匹配）`
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*105$/,
    message () {
      return '【帮@所有人】@小迷弟+“@所有人”即可帮你@全部成员啦'
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*106$/,
    message () {
      return '【每日笑话】@小迷弟+“笑话”就有笑话看啦'
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*107$/,
    message () {
      return `【火车票查询】
      
1、@小迷弟+“火车票查询” + 出发地点 + 目的地点 + 出发日期 + 车次信息 + 座位类型即可实时查询火车票余票信息（PS：各项信息需以空格隔开）

1.1、出发地点，如：广州南（必填）

1.2、目的地点，如：江门东（必填）

1.3、出发日期，格式为YYYY-MM-DD，如：2020-01-01（必填）

1.4、车次信息，如：C7223或者C7223&C7201，多车次以“&”分隔（非必填，不填或者填“全部”则为查询所有车次）

1.5、座位类型，如：二等座或者一等座&二等座，多类型以“&”分隔（非必填，不填或者填“全部”则为查询所有座位类型）

1.6、示例1：@小迷弟+“火车票查询 广州南 江门东 2020-01-01”

1.7、示例2：@小迷弟+“火车票查询 广州南 江门东 2020-01-01 全部 二等座&一等座”

2、@小迷弟+“火车票查询结果”即可查看你的相关火车票查询任务信息
      
3、@小迷弟+“火车票查询取消”即可取消当前你的火车票查询任务（PS：查询成功的任务会自动取消哒）`
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*108$/,
    message () {
      return '【每日星座运势】@小迷弟+星座名+“运势”即可查看对应的当天星座运势'
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*109$/,
    message () {
      return '【给头像戴上圣诞帽】@小迷弟+“圣诞帽”即可戴上圣诞帽啦'
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*110$/,
    message () {
      return `【消息回看】

1、@小迷弟+“消息回看”+qq号+消息序号即可回看消息

2、qq号：必填，支持模糊填写，可以不用填写完整qq号哟

3、消息序号：非必填，不填则默认为1，表示回看所填qq号的最新一条消息

4、qq号和消息序号需以空格隔开

5、此功能暂时为群主专属功能`
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*250$/,
    message () {
      return '亲，洗洗睡吧，没有更多功能了啦Σ(*ﾟдﾟﾉ)ﾉ'
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*@\s?所有人$/,
    message (msg, context) {
      const name = context.sender.card || context.sender.nickname
      return `[CQ:at,qq=all] ${name}有事找你们，看到请回一下呢。[CQ:face,id=212]`
    }
  },
  {
    name: 'chat',
    rule: /^\[CQ:at,qq=\d+\]\s*圣诞帽$/,
    message (msg, context) {
      const qq = context.sender.user_id
      const avatar = `http://q.qlogo.cn/headimg_dl?dst_uin=${qq}&spec=640`
      const message = [{
        type: 'share',
        data: {
          url: `http://111.230.244.116:8080/avatar?qq=${qq}`,
          title: '给头像戴上圣诞帽',
          content: '快点我快点我快点我~',
          image: avatar
        }
      }]
      return message
    }
  }
]

module.exports = chatMsg
