const admin = require("firebase-admin")
const config = require('../config/config')

// init firebase-admin
try {
    admin.initializeApp({
        credential: admin.credential.cert(config.firebase),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    })
    admin.database.enableLogging(true)
} catch (e) {
  console.log('errInitFirebase', e)
}

// notify func to send multicast
const notify = (message) => {
  return admin.messaging().sendMulticast(message)
}

// debugger on sending message
const _debugger = async (message) => {

  try {
    const res = await notify(message)
    console.log(res.successCount + ' messages were sent successfully')

    if (res.failureCount > 0) {

      const failedTokens = []
      res.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(registrationTokens[idx])
        }
      })

      console.log('List of tokens that caused failures: ' + failedTokens)
    }
  } catch(e) {
    console.log('_debuggerFcm', e)
  }
}

const sendMessageNotification = (devicesToken, title, body, clickAction) => {

    const debug = config.firebase.debug // debug purpose

    const message = {
      webpush: {
        notification: {
          title: title,
          body: body,
          icon: 'img/icons/android-chrome-192x192.png',
          click_action: clickAction,
        },
      },
      tokens: devicesToken,
    }

    try {
      if (debug) return _debugger(message)
      return notify(message)
    } catch (e) {
      console.log('onNotify', e)
    }
}

module.exports = {
  sendMessageNotification
}
