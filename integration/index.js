const schedule = require('node-schedule')

const register = (server, options, next) => {
  schedule.scheduleJob("*/1 * * * *", function() {
    console.log('PUBSUB runs every 1 minutes')
    const { PubSub } = require('@google-cloud/pubsub');
    const pubsubClient = new PubSub()
    const subscriptionName = process.env.SUBSCRIPTION_NAME
    let timeout = 60
    let msgCount = 0

    try {
      const subscriber = pubsubClient.subscription(subscriptionName)
      const msgHandler = (message) => {
        // console.log(`Received message ${message.id}:`);
        // console.log(`\tData: ${message.data}`);
        // console.log(`\tAttributes: ${message.attributes}`);
        msgCount += 1;

        /**
         * TODO: create function service for get data from pub sub
         * code create here
         */
        const data = Buffer.from(message.data, 'base64').toString()
        server.methods.services.integration.createInfoClinics(data)

        message.ack();
      }

      subscriber.on('message', msgHandler)

      setTimeout(() => {
            subscriber.removeListener('message', msgHandler);
            console.log(`${msgCount} message(s) received.`);
        }, timeout * 1000);

    } catch (error) {
      console.log(`ERROR PUBSUB: ${error}`);
    }

  });

  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register