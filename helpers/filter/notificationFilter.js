const ObjectId = require('mongodb').ObjectID

const filterNotification = (query, userId) => {
  const params = {
    recipientId: ObjectId(userId)
  }

  if (query.isRead) {
    params.isRead = query.isRead
  }

  if (query.eventType) {
    params.eventType = query.eventType
  }
  return params
}

const searchNotification = (query) => {
  let search_params = {}
  if (query.search) { search_params = [ { message: new RegExp(query.search, "i") } ] }
  return search_params
}

module.exports = {
  filterNotification,
  searchNotification,
}
