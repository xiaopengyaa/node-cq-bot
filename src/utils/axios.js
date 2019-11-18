const axios = require('axios')
const { isTimeout } = require('./common')

const defaultConfig = {
  retryCount: 0, // 重放次数
  retry: 1, // 超时重放总次数
  retryDelay: 1000, // 重放时间间隔
}
axios.defaults.timeout = 0 // 请求超时时间，默认没有

// 响应拦截
axios.interceptors.response.use(
  response => {
    defaultConfig.retryCount = 0
    return response
  },
  err => {
    // 超时处理
    if (isTimeout(err)) {
      const config = Object.assign({}, defaultConfig, err.config)
      // 检查重放次数是否超过总次数
      if (defaultConfig.retryCount >= config.retry) {
        defaultConfig.retryCount = 0
        return Promise.reject(err)
      }
      defaultConfig.retryCount++
      console.log('重放次数：', defaultConfig.retryCount)
      const back = new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, config.retryDelay)
      })
      return back.then(() => {
        return axios.request(config)
      })
    } else {
      defaultConfig.retryCount = 0
      return Promise.reject(err)
    }
  }
)

// 封装api
const api = {
  async get(url, data, config = {}) {
    try {
      console.log('api请求中...')
      const res = await axios.get(url, {
        params: data,
        ...config
      })
      console.log('api:', res.statusText || res.status)
      return new Promise(resolve => {
        resolve(res.data)
      })
    } catch (err) {
      if (isTimeout(err)) {
        return err
      } else {
        throw new Error(err)
      }
    }
  },
  async post(url, data, config) {
    try {
      console.log('api请求中...')
      const res = await axios.post(url, data, config)
      console.log('api:', res.statusText || res.status)
      return new Promise(resolve => {
        resolve(res.data)
      })
    } catch (err) {
      if (isTimeout(err)) {
        return err
      } else {
        throw new Error(err)
      }
    }
  }
}

module.exports = api