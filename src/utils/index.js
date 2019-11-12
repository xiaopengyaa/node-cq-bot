const axios = require('axios')
const utils = {
  // 封装axios
  api: {
    async get(url, data, config = {}) {
      try {
        const res = await axios.get(url, {
          params: data,
          ...config
        })
        return new Promise(resolve => {
          resolve(res.data)
        })
      } catch (err) {
        console.log(err)
      }
    },
    async post(url, data, config) {
      try {
        const res = await axios.post(url, data, config)
        return new Promise(resolve => {
          resolve(res.data)
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  // 生成随机范围数
  random (min, max) {
    return Math.round(Math.random() * (max - min)) + min
  }
}

module.exports = utils