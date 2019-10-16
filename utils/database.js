
import { config } from '../config.js'
wx.cloud.init({
  env: config.env
})

const db = wx.cloud.database({
  env: config.env
})

module.exports = { db }