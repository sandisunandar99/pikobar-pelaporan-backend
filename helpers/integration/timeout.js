const {PubSub} = require('@google-cloud/pubsub')
const {pubsub} = require('../../config/config')
const pubsubClient = new PubSub(pubsub)
const timeout = 60

const setTimeOut = (subscribe, msgHandler) => {
  const subscriber = pubsubClient.subscription(subscribe)

   setTimeout(() => {
        subscriber.removeListener('message', msgHandler);
    }, timeout * 1000);
}

module.exports = {
  setTimeOut
}