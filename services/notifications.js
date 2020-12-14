const moment = require('moment')
const Case = require('../models/Case')
const schedule = require('node-schedule')
const ObjectId = require('mongodb').ObjectID
const paginate = require('../helpers/paginate')
const Notification = require('../models/Notification')
const filters = require('../helpers/filter/notificationFilter')
const { CRITERIA, WHERE_GLOBAL } = require('../helpers/constant')
const { notify } = require('../helpers/notification')

// run job
schedule.scheduleJob('0 10 * * *', () => {
  JobClosecContactFinishedQuarantine()
})

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
    const { id, all } = query
    const params = all === '1' ? {} : {  _id: ObjectId(id) }
    const res = await Notification.updateOne(
      { ...params },
      { $set: { isRead: true } }
    )
    callback(null, res)
  } catch (e) {
    callback(e, null)
  }
}

async function JobClosecContactFinishedQuarantine () {
  try {
    const twelveDaysAgo = moment().subtract(12, 'days').startOf('day') // hari ke 13 masa karantina
    const thirteenDaysAgo = moment().subtract(13, 'days').startOf('day') // hari ke 14 masa karantina

    const findParams = {
      ...WHERE_GLOBAL,
      status: CRITERIA.CLOSE,
      final_result: '5',
      last_date_status_patient: {
        $exists: true,
        $nin: ['', null],
        $lt: new Date(twelveDaysAgo),
        $gte: new Date(thirteenDaysAgo),
      },
    }

    const data = await Case.find(findParams)
    for (let i in data) {
      notify('ClosecContactFinishedQuarantine', data[i], { role: 'scheduler' })
    }

  } catch (e) {
    console.log('JobClosecContactFinishedQuarantine', e)
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
