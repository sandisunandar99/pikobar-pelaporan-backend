'use strict';
const Glue = require('glue');
const manifest = require('./config/manifest');
const config = require('./config/config')
const Sentry = require("@sentry/node")

Glue.compose(manifest, { relativeTo: __dirname }, (err, server) => {
  if (err) {
    console.log('server.register err:', err);
  }

  Sentry.init(config.sentry)
  server.start(() => {
    console.log('✅  Server is listening on ' + server.info.uri.toLowerCase());
  });
});