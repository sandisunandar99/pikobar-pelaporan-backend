'use strict';
const Glue = require('glue');
const manifest = require('./config/manifest');
const config = require('./config/config')
const Sentry = require("@sentry/node")
const schedule = require('node-schedule')

if (!process.env.PRODUCTION) {
  manifest.registrations.push({
    "plugin": {
      "register": "blipp",
      "options": {}
    }
  });
}

schedule.scheduleJob("*/1 * * * *", function() {
  console.log('This runs every 1 minutes')

  const { PubSub } = require('@google-cloud/pubsub');
  require('dotenv').config()

  const credentials = {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
  }

  const projectId = process.env.PROJECT_ID
  const subscriptionName = process.env.SUBSCRIPTION_NAME
  let timeout = 60

  timeout = Number(timeout);

  const pubSubClient = new PubSub({ projectId, credentials });

  function listenForMessages() {
    const subscription = pubSubClient.subscription(subscriptionName);

    let messageCount = 0;
    const messageHandler = (message) => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);
      messageCount += 1;

      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);

    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${messageCount} message(s) received.`);
    }, timeout * 1000);
  }

  listenForMessages();
  // [END pubsub_subscriber_async_pull]
  // [END pubsub_quickstart_subscriber]
});

Glue.compose(manifest, { relativeTo: __dirname }, (err, server) => {
  if (err) {
    console.log('server.register err:', err);
  }

  Sentry.init(config.sentry)
  server.start(() => {
    console.log('✅  Server is listening on ' + server.info.uri.toLowerCase());
  });
});