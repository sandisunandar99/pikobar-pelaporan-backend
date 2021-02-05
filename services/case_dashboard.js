const Case = require('../models/Case')
const { summaryAggregate }  = require('../helpers/aggregate/summaryaggregate')
const { topAggregate }  = require('../helpers/aggregate/topaggregate')

async function countSectionTop(query, user, callback) {
  try {
    const resultCount = await sameCondition(query, user, topAggregate)
    callback(null, resultCount)
  } catch (e) {
    callback(`error in ${e}`, null)
  }
}

async function countSummary(query, user, callback) {
  try {
    const resultCount = await sameCondition(query, user, summaryAggregate)
    resultCount.map(res => {
      res.summary.map(s => {
        if (user.code_district_city === s.name[0].id){
          s._id = s._id
        } else {
          s._id = `Diluar kota/kab ${s._id}`
        }
        return s
      })

      res.demographic.map(d => {
        if (user.code_district_city === d.name[0].id){
          d._id = d._id
        } else {
          d._id = `Diluar kota/kab ${d._id}`
        }
        return d
      })

      return res
    })
    callback(null, resultCount)
  } catch (e) {
    callback(e, null)
  }
}

async function countVisualization(query, user, callback) {
  const { visualizationAggregate }  = require('../helpers/aggregate/visualizationaggregate')
  try {
    const condition = await visualizationAggregate(query, user)
    const resultCount = await Case.aggregate(condition)
    callback(null, resultCount)
  } catch (e) {
    callback(e, null)
  }
}

const sameCondition = async (query, user, models) => {
  const condition = await models(query, user)
  const resultCount = await Case.aggregate(condition)

  return resultCount
}

module.exports = [
  {
    method: countSectionTop,
    name: 'services.case_dashboard.countSectionTop',
  },{
    name: 'services.case_dashboard.countSummary',
    method: countSummary,
  },{
    name: 'services.case_dashboard.countVisualization',
    method: countVisualization,
  }
]
