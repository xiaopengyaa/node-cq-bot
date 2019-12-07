const { api } = require('../utils')

const url = {
  ticket: 'https://m.ctrip.com/restapi/soa2/14666/json/GetBookingByStationV3ForPC'
}

const ticketApi = {
  // 火车票查询
  async getTicket(data) {
    const res = await api.post(url.ticket, data)
    return res
  }
}

module.exports = ticketApi