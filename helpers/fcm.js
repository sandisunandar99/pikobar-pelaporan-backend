const admin = require("firebase-admin")
const config = require('../config/config')

try {
    admin.initializeApp({
        credential: admin.credential.cert(config.firebase),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    })
    admin.database.enableLogging(true);
} catch (e) {}

const send = (fcmTokens) => {

    const debug = false
    const registrationTokens = fcmTokens    
    const message = {
        data: {},
        tokens: registrationTokens,
    }
    
    try {
        admin.messaging().sendMulticast(message)
        .then((response) => {
            if (debug) console.log(response.successCount + ' messages were sent successfully')
            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                    failedTokens.push(registrationTokens[idx]);
                    }
                });
                if (debug) console.log('List of tokens that caused failures: ' + failedTokens);
            }
        });
    } catch (e) {}
}

module.exports = {
    send
}
