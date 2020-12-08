const ObjectId = require('mongodb').ObjectID
const paginate = require('../helpers/paginate')
const Notification = require('../models/Notification')
const filters = require('../helpers/filter/notificationFilter')

async function getUserNotifications (userId, query, callback) {
  try {
    const sorts = { createdAt: 'desc' }
    const options = paginate.optionsLabel({ page: 1, limit: 10, ...query}, sorts, [])
    const params = filters.filterNotification(query, userId)
    const searchParams = filters.searchNotification(query)
    const result = Notification.find(params).or(searchParams)
    const paginateResult = await Notification.paginate(result, options)
    callback(null, paginateResult)
  } catch (e) {
    callback(e, null)
  }
}

async function markAsRead (query, callback) {
  try {
    const { id } = query
    const res = await Notification.updateOne(
      { _id: ObjectId(id) },
      { $set: { isRead: true } }
    )
    callback(null, res)
  } catch (e) {
    callback(e, null)
  }
}

module.exports = [
  {
    name: 'services.notifications.get',
    method: getUserNotifications,
  },
  {
    name: 'services.notifications.markAsRead',
    method: markAsRead,
  },
]
