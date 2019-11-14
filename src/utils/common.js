const common = {
  // 生成随机范围数
  random (min, max) {
    return Math.round(Math.random() * (max - min)) + min
  },
  // 是否超时
  isTimeout (err) {
    return err.code === 'ECONNABORTED' && err.message.includes('timeout')
  }
}

module.exports = common