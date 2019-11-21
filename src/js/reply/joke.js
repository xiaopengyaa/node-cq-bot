const moment = require('moment')
const fs = require('fs')
const path = require('path')
const { random } = require('../../utils')
const today = moment().format('YYYY-MM-DD')

// 读取笑话json
let jokeObj = {}
let jokeList = []
try {
  jokeObj = JSON.parse(fs.readFileSync(path.join(__dirname, '../../json/joke.json')))
  jokeList = jokeObj[today] || ['暂无笑话']
} catch (e) {
  console.log(e)
  jokeList = ['暂无笑话']
}

const jokeMsg = [
  {
    name: 'joke',
    rule: /^\[CQ:at,qq=\d+\]\s*笑话$/,
    async message () {
      return `【笑话不在多，好笑则行】\r\n${jokeList[random(0, jokeList.length - 1)]}`
    }
  }
]

module.exports = jokeMsg