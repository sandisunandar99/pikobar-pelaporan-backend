const Pusher = require('pusher')

const config = require('../config/config')

const pusher = new Pusher(config.pusher)

const send = (channel, event, data) => {
  try {
    return pusher.trigger(channel, event, data)
  } catch (error) {
    return error
  }
}

module.exports = {
    send
}