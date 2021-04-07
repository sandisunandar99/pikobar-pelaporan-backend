const schedule = require('node-schedule')
const {PubSub} = require('@google-cloud/pubsub')
const {pubsub} = require('../config/config')
const laporMandiriSub = process.env.SUBSCRIPTION_NAME_LAPORMANDIRI
const pubsubClient = new PubSub(pubsub)
const {setTimeOut} = require('../helpers/integration/timeout')

module.exports = (server) => {
  schedule.scheduleJob("*/1 * * * *", function () {
    console.log('Worker Pikobar Lapor Mandiri runs every 1 minutes')

    try {
      const subscriber = pubsubClient.subscription(laporMandiriSub)
      const msgHandler = async (message) => {
        const data = Buffer.from(message.data, 'base64').toString()
        let payload = await server.methods.services.integration.createInfoClinics(data)
        await server.methods.services.histories.createIfChanged({payload}, (err, result) => { console.log(`Data Pikobar Reveived.. ID : ${message.id} ---- ERR: ${err}`)})
        message.ack();
      }

      const errorHandler = (error) => {
        console.error(`ERROR: ${error}`);
        throw error;
      }

      subscriber.on('error', errorHandler)
      subscriber.on('message', msgHandler)
      setTimeOut(laporMandiriSub, msgHandler, errorHandler)

    } catch (error) {
      console.log(`ERROR PUBSUB PIKOBAR: ${error}`);
    }
  });
}