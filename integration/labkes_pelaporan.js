const schedule = require('node-schedule')
const { PubSub } = require('@google-cloud/pubsub')
const { pubsub } = require('../config/config')
const labkesPelaporanSub = process.env.SUBSCRIPTION_NAME2
const pubsubClient = new PubSub(pubsub)
const {setTimeOut} = require('../helpers/integration/timeout')
const {getCountBasedOnDistrict} = require('../helpers/cases/global')

module.exports = (server) => {
  schedule.scheduleJob("*/1 * * * *", function() {
    console.log('Worker Labkes Pelaporan runs every 1 minutes')

    try {
      const subscriber = pubsubClient.subscription(labkesPelaporanSub)
      const msgHandler = async (message) => {
          try {
            const data = Buffer.from(message.data, 'base64').toString()
            let payload = await server.methods.services.integration.createOrUpdateCase(data)
            // const services = server.methods.services
            // const pre = await getCountBasedOnDistrict (services)

            message.ack();
          } catch (error) {console.log(error)}
      }

      subscriber.on('message', msgHandler)
      setTimeOut(labkesPelaporanSub, msgHandler)

    } catch (error) {
      console.log(`ERROR PUBSUB: ${error}`);
    }
  });
}