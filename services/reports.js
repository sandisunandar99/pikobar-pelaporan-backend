const moment = require('moment')
const Case = require('../models/Case')
const Check = require('../helpers/rolecheck')

const { 
  generateGroupedDailyReport
} = require('../helpers/reports/handler')

async function dailyReport(query, user, callback) {
  try {
    const date = query.date ? new Date(query.date) : undefined
    const dates = {
      aDay: moment(date).format('YYYY-MM-DD'),
      aDueDay: moment(date).add(1,'days').format('YYYY-MM-DD'),
      aWeek: moment(date).subtract(1,'weeks').add(1,'days').format('YYYY-MM-DD'),
      aMonth: moment(date).subtract(1,'months').add(1, 'days').format('YYYY-MM-DD')
    }

    const searching = Check.countByRole(user)

    const match = {
      $match: {
        $and: [
          searching, { delete_status: { $ne: 'deleted' }, verified_status: 'verified'},
        ]
      }
    }

    const lookup = {
      $lookup: {
        from: 'histories',
        localField: 'last_history',
        foreignField: '_id',
        as: 'last_history'
      }
    }

    const unwind = { $unwind: '$last_history' }

    const group = generateGroupedDailyReport(dates)

    const aggQuery = [
      match,
      lookup,
      unwind,
      group
    ]

    const result = await Case.aggregate(aggQuery)
    callback(null, result)
  } catch (e) {
    callback(e, null)
  }
}

module.exports = [
  {
    name: 'services.reports.dailyReport',
    method: dailyReport,
  }
]
