const moment = require('moment')
const Case = require('../models/Case')
const Check = require('../helpers/rolecheck')

const { 
  generateGroupedDailyReport
} = require('../helpers/reports/handler')

async function dailyReport(query, user, callback) {
  try {
    const dates = {
      aDay: moment().format('YYYY-MM-DD'),
      aDueDay: moment().add(1,'days').format('YYYY-MM-DD'),
      aWeek: moment(this.aDay).subtract(7,'days').format('YYYY-MM-DD'),
      aMonth: moment(this.aDay).subtract(1,'months').format('YYYY-MM-DD')
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
      $lookup:
      {
        from: 'histories',
        let: { lastHistory: "$last_history" },
        pipeline: [
          { $match:
              { $expr:
                { $and:
                    [
                      { $eq: [ "$_id",  "$$lastHistory" ] },
                      { $gte: [ "$createdAt", new Date(dates.aMonth) ] },
                      { $lt: ["$createdAt", new Date(dates.aDueDay) ] }
                    ]
                }
              },
          }
        ],
        as: 'last_history'
      },
    }

    const unwind = { $unwind: '$last_history' }

    const group = generateGroupedDailyReport(dates)

    const conditions = [
      match,
      lookup,
      unwind,
      group
    ]

    const result = await Case.aggregate(conditions)
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
