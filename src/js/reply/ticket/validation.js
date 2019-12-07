const validation = [
  {
    name: 'DepartStation',
    message: '请输入出发地点（如：广州南）',
    validate (val) {
      return !!val
    }
  },
  {
    name: 'ArriveStation',
    message: '请输入目的地点（如：江门东）',
    validate (val) {
      return !!val
    }
  },
  {
    name: 'DepartDate',
    message: '请输入出发日期（如：2020-01-01）',
    validate (val) {
      const reg = /^\d{4}-\d{1,2}-\d{1,2}$/
      return reg.test(val)
    }
  },
  {
    name: 'TrainName',
    message: '',
    validate () {
      return true
    }
  },
  {
    name: 'SeatType',
    message: '',
    validate () {
      return true
    }
  }
]

module.exports = validation