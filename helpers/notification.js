const fcm = require('./fcm')
const send = async (Notification, User, referenceCase, author, event) => {
  try {
    let tag, message, params
    
    if (event === 'case-created') {
      if (author.role === 'faskes') {
        tag = 'faskes-case-created'
        message = 'Pengajuan Kasus Baru Dari faskes' 
        to = 'dinkeskota'
      }
    } else if (event === 'case-verification-verified') {
      tag = 'case-verification-verified'
      message = 'Kasus Terverifikasi' 
      to = 'faskes'
    } else if (event === 'case-verification-declined') {
      tag = 'case-verification-declined'
      message = 'Kasus Ditolak' 
      to = 'faskes'
    } else if (event === 'case-verification-pending') {
      tag = 'case-verification-pending'
      message = 'Pengajuan Kasus Yang ditolak Dari faskes' 
      to ='dinkeskota'
    }

    const recipientIds = await User.find({role: to, code_district_city: author.code_district_city}).select(['_id', 'fcm_token'])

    if (!recipientIds) return

    let payload = []
    for (i in recipientIds) {
      item = recipientIds[i]
      payload.push(new Notification({
        tag: tag,
        message: message,
        case: referenceCase._id || null,
        sender: author._id,
        recipient: item._id,
        read_at: null
      }))
    }

    const fcmTokens = recipientIds.filter(x => !!x.fcm_token).map(obj => obj.fcm_token)
    fcm.send(fcmTokens)
    return Notification.insertMany(payload)
  } catch (error) {
    console.log('err', error)
    return error
  }
}

module.exports = {
    send
}