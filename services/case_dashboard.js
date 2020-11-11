'use strict'
const Case = require('../models/Case')
const { summaryAggregate }  = require('../helpers/aggregate/summaryaggregate')
const { topAggregate }  = require('../helpers/aggregate/topaggregate')

async function countSectionTop(query, user, callback) {
  try {
    const resultCount = await sameCondition(query, user, topAggregate)
    callback(null, resultCount)
  } catch (e) {
    callback(e, null)
  }
}

async function countSummary(query, user, callback) {
  try {
    const resultCount = await sameCondition(query, user, summaryAggregate)
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
