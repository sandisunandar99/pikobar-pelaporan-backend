const moment = require('moment')
const Case = require('../models/Case')
const Check = require('../helpers/rolecheck')

const { 
  CRITERIA 
} = require('../helpers/constant')

const { 
  sum,
  sumBasedOnLocation
} = require('../helpers/filter/dailyreportfilter')

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

    const group = {
      "$facet": {
        'suspect': [
          {
            $group: {
              _id: 'suspect',
              ...sum([{ $eq: ['$status', CRITERIA.SUS] }], dates)
            }
          }
        ],
        'confirmed': [
          {
            $group: {
              _id: 'confirmed',
              ...sum([{ $eq: ['$status', CRITERIA.CONF] }], dates)
            }
          }
        ],
        'closeContact': [
          {
            $group: {
              _id: 'suspect',
              ...sum([{ $eq: ['$status', CRITERIA.CLOSE] }], dates)
            }
          }
        ],
        'deceaseConfirmed': [
          {
            $group: {
              _id: 'decease',
              ...sum([
                { $eq: ['$status', CRITERIA.CONF] },
                { $eq: ['$final_result', '2'] },
              ], dates)
            }
          }
        ],
        'deceaseProbable': [
          {
            $group: {
              _id: 'decease',
              ...sum([
                { $eq: ['$status', CRITERIA.PROB] },
                { $eq: ['$final_result', '2'] },
              ], dates)
            }
          }
        ],
        'suspectProbableIsolation': [
          {
            $group: {
              _id: 'emergencyHospitalIsolation',
              ...sumBasedOnLocation([
                { $in: [ '$status', [CRITERIA.SUS, CRITERIA.PROB] ] },
              ], dates)
            }
          }
        ],
        'confirmedIsolation': [
          {
            $group: {
              _id: 'emergencyHospitalIsolation',
              ...sumBasedOnLocation([
                { $eq: [ '$status', CRITERIA.CONF ] },
              ], dates)
            }
          }
        ],
        'closeContactIsolation': [
          {
            $group: {
              _id: 'closeContactIsolation',
              ...sumBasedOnLocation([
                { $eq: [ '$status', CRITERIA.CLOSE ] },
                { $ne: [ '$final_result', null ] },
              ], dates)
            }
          }
        ],
      }
    }

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
