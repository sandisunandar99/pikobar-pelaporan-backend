const paginate = require('../helpers/paginate')
const Notification = require('../models/Notification')

async function getUserNotifications (userId, callback) {
  try {
    const sorts = { createdAt: 'desc' }
    const options = paginate.optionsLabel(query, sorts, [])
    const params = filters.filterUser(query, userId)
    const searchParams = filters.searchUser(query)
    const result = User.find(params).or(searchParams)
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
