const Case = require('../models/Case')
const { summaryAggregate }  = require('../helpers/aggregate/summaryaggregate')
const { topAggregate }  = require('../helpers/aggregate/topaggregate')

const mapingCondition = (user, obj) => {
  if (user.code_district_city === obj.name[0].id){
    obj._id = obj._id
  } else {
    obj._id = `Diluar kota/kab ${obj._id}`
  }
  return obj
}

const validationRole = (result, user) => {
  const { ROLE } = require("../helpers/constant")
  if([ROLE.ADMIN, ROLE.PROVINCE].includes(user.role)){
    return result
  } else {
    result.map(res => {
      res.summary.map(s =>  mapingCondition(user, s))
      res.demographic.map(d => mapingCondition(user, d))
      return res
    })
  }

  return result
}

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
    const result = validationRole(resultCount, user)
    callback(null, result)
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
