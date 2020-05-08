var admin = require("firebase-admin")

try {
    console.log('s')
    var serviceAccount = require("../firebase-service-account.json")
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://pikobar-pelaporan-development.firebaseio.com"
      })
      
    admin.database.enableLogging(true);
} catch (e) {}


const send = (fcmTokens) => {

    if (!serviceAccount) return

    const registrationTokens = fcmTokens
    
    const message = {
        data: {},
        tokens: registrationTokens,
    }
    
    admin.messaging().sendMulticast(message)
        .then((response) => {
            console.log(response.successCount + ' messages were sent successfully')
        })
}

module.exports = {
    send
}