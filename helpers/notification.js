const { model } = require('mongoose')
const lang = require('./dictionary/id.json')
const { sendMessageNotification } = require('./firebase')
const { CLICK_ACTION, EVENT_TYPE, ROLE } = require('./constant')

const {
  case_has_been_declined,
  case_has_been_verified,
  faskes_cases_created,
  faskes_cases_recreated,
} = lang.titles

const { KOTAKAB, FASKES } = ROLE

const {
  ACT_CASES_LIST,
  ACT_CASES_VERIFICATION_LIST,
  ACT_RDT_LIST,
  ACT_SYSTEM_UPDATES,
} = CLICK_ACTION

const {
  EVT_CASE_CREATED,
  EVT_CASE_REVISED,
  EVT_CASE_VERIFIED,
  EVT_CASE_DECLINED,
} = EVENT_TYPE

const eventName = (role, event) => `${role}:${event}`

const MessageNotification = (title, body, eventRole, eventType, clickAction, to) => {
  return { title, body, eventRole, eventType, clickAction, to }
}

const getMessagePayload = (event, data, author) => {
  let message, payload = {}

  switch (event) {
    case eventName(FASKES, EVT_CASE_CREATED):
      message = `Terdapat ${faskes_cases_created} ${author.fullname} a/n ${data.name.toUpperCase()}`
      payload = MessageNotification(faskes_cases_created, message, FASKES, EVT_CASE_CREATED, ACT_CASES_VERIFICATION_LIST, KOTAKAB)
      break
    case eventName(KOTAKAB, 'EVT_CASE_VERIFIED'):
      message = `${case_has_been_verified} a/n Masih Dummy`
      payload = MessageNotification(case_has_been_verified, message, KOTAKAB, EVT_CASE_VERIFIED, ACT_CASES_LIST, FASKES)
      break
    case eventName(KOTAKAB, EVT_CASE_DECLINED):
      message = `${case_has_been_declined} a/n Masih Dummy`
      payload = MessageNotification(case_has_been_declined, message, KOTAKAB, EVT_CASE_DECLINED, ACT_CASES_VERIFICATION_LIST, FASKES)
      break
    case eventName(FASKES, 'EVT_CASE_REVISED'):
      message = `${faskes_cases_recreated} a/n Masih Dummy`
      payload = MessageNotification(faskes_cases_recreated, message, FASKES, EVT_CASE_REVISED, ACT_CASES_VERIFICATION_LIST, KOTAKAB)
      break
    default:
  }

  return payload
}

const notify = async (event, data, author) => {
  try {
    const messgPayload = getMessagePayload(eventName(author.role, event), data, author)
    const { title, body, eventRole, eventType, clickAction, to } = messgPayload

    if (!to) return

    const recipientUIds = await model('User').find({role: to, code_district_city: author.code_district_city}).select(['_id'])

    const deviceTokens = await model('UserDevice').find({ userId: { $in: recipientUIds.map(u => u._id) } }).select(['token', 'userId'])

    const payload = [], tokens = [];
    for (i in deviceTokens) {
      tokens.push(deviceTokens[i].token)
      payload.push({
        message: body,
        eventRole: eventRole,
        eventType: eventType,
        referenceId: data._id,
        senderId: author._id,
        recipientId: deviceTokens[i].userId,
      })
    }

    if (!tokens.length) return

    // firebase cloud messaging: send multicast
    sendMessageNotification(tokens, title, body, clickAction)
    return model('Notification').insertMany(payload)
  } catch (error) {
    console.log('err', error)
    return error
  }
}

module.exports = {
  notify,
}
