const conf = {}
const Sentry = require("@sentry/node")
const Tracing = require("@sentry/tracing")
const SECRET_KEY = process.env.SECRET_KEY
const ENCODING = process.env.ENCODING

conf.auth = {
  secret: Buffer.from(SECRET_KEY, ENCODING),
  tokenType: 'Bearer',
  algorithm: 'HS256',
  verifyOptions: { algorithms: [ 'HS256' ] }
};

conf.database = {
  uri: process.env.MONGO_DB_URI,
  options: {
    keepAlive: 300000,
    connectTimeoutMS: 300000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    promiseLibrary: global.Promise,
    useFindAndModify: false,
    useCreateIndex: true
  }
};
conf.sentry = {
  dsn: process.env.SENTRY_DSN,
  attachStacktrace: true,
  debug: true,
  environment: process.env.NODE_ENV || 'local',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Mongo
  ],
  tracesSampleRate: process.env.SENTRY_TRACE_RATE,
}

conf.firebase = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: Buffer.from(process.env.FIREBASE_PRIVATE_KEY, 'base64').toString(),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_DATABASE_URL,
  debug: process.env.FIREBASE_DEBUG === 'true'
};

conf.pubsub = {
    projectId: process.env.PUBSUB_PROJECT_ID,
    credentials: {
      type: "service_account",
      project_id : process.env.PUBSUB_PROJECT_ID,
      private_key_id : process.env.PUBSUB_PRIVATE_KEY_ID,
      private_key : Buffer.from(process.env.PUBSUB_PRIVATE_KEY, 'base64').toString(),
      client_email : process.env.PUBSUB_CLIENT_EMAIL,
      client_id : process.env.PUBSUB_CLIENT_ID,
      auth_uri : process.env.PUBSUB_AUTH_URI,
      token_uri : process.env.PUBSUB_TOKEN_URI,
      auth_provider_x509_cert_url : process.env.PUBSUB_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url : process.env.PUBSUB_CLIENT_X509_CERT_URL
    }
}

conf.beeQueue = {
  isWorker: true,
  removeOnSuccess: true,
  activateDelayedJobs: true,
  removeOnFailure: false,
  stallInterval: 5000,
  nearTermWindow: 1200000,
  delayedDebounce: 6000,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  }
}

module.exports = conf;