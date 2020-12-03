const lang = require('./dictionary/id.json')
const {
  case_has_been_declined,
  case_has_been_verified,
  faskes_cases_created,
  faskes_cases_recreated,
} = lang.titles
const { sendMessageNotification } = require('./firebase')

const { CLICK_ACTION, ROLE } = require('./constant')

const { KOTAKAB, FASKES } = ROLE

const {
  CASES_LIST, CASES_VERIFICATION_LIST, RDT_LIST, SYSTEM_UPDATES,
} = CLICK_ACTION

const MessageNotification = (title, body, clickAction, to) => {
  return {
    title: title,
    body: body,
    clickAction: clickAction,
    to: to,
  }
}

const getMessagePayload = (event, data, author) => {
  let messageBody, params = []

  switch (event) {
    case 'faskes-case-created':
      messageBody = `Terdapat ${faskes_cases_created} ${author.fullname} a/n ${data.name.toUpperCase()}`
      params = [ faskes_cases_created, messageBody, CASES_VERIFICATION_LIST, KOTAKAB ]
      break
    case 'case-verification-verified':
      messageBody = `${case_has_been_verified} a/n Masih Dummy`
      params = [ case_has_been_verified, messageBody, CASES_VERIFICATION_LIST, FASKES ]
      break
    case 'case-verification-declined':
      messageBody = `${case_has_been_declined} a/n Masih Dummy`
      params = [ case_has_been_declined, messageBody, CASES_VERIFICATION_LIST, FASKES ]
      break
    case 'case-verification-pending':
      messageBody = `${faskes_cases_recreated} a/n Masih Dummy`
      params = [ faskes_cases_recreated, messageBody, CASES_VERIFICATION_LIST, KOTAKAB ]
      break
    default:
  }

  return MessageNotification(...params)
}

const send = async (Notification, User, referenceCase, author, event) => {
  try {
    const messgPayload = getMessagePayload(event, referenceCase, author)
    const { title, body, clickAction, to } = messgPayload

    if (!to) return

    const recipientIds = await User.find({role: to, code_district_city: author.code_district_city}).select(['_id', 'fcm_token'])

    if (!recipientIds) return

    let payload = []
    for (i in recipientIds) {
      item = recipientIds[i]
      payload.push(new Notification({
        tag: title,
        message: body,
        case: referenceCase._id || null,
        sender: author._id,
        recipient: item._id,
        read_at: null
      }))
    }

    const devicesToken = recipientIds.filter(x => !!x.fcm_token).map(obj => obj.fcm_token)

    // firebase cloud messaging: send multicast
    sendMessageNotification(devicesToken, title, body, clickAction)
    return Notification.insertMany(payload)
  } catch (error) {
    console.log('err', error)
    return error
  }
}

module.exports = {
    send
}
