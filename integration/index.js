const schedule = require('node-schedule')
const { PubSub } = require('@google-cloud/pubsub')
const { pubsub } = require('../config/config')
const credential = pubsub.credentials
const projectId = process.env.GCP_PROJ_ID
const subscriptionName = process.env.SUBSCRIPTION_NAME
const pubsubClient = new PubSub(pubsub)
const timeout = 60
let msgCount = 0

const register = (server, options, next) => {
  schedule.scheduleJob("*/1 * * * *", function() {
    console.log('Worker Google Pub/Sub runs every 1 minutes')

    try {
      const subscriber = pubsubClient.subscription(subscriptionName)
      const msgHandler = async (message) => {
          msgCount += 1;
          try {
            const data = Buffer.from(message.data, 'base64').toString()
            let payload = await server.methods.services.integration.createInfoClinics(data)
            await server.methods.services.histories.createIfChanged({payload}, (err, result)=> {console.log(`Data Sent.. ID : ${message.id}`);})

            message.ack();
          } catch (error) {console.log(error)}
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