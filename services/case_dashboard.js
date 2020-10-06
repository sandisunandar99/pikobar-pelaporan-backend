'use strict'
const Case = require('../models/Case')
const { topAggregate }  = require('../helpers/aggregate/topaggregate')
const { summaryAggregate }  = require('../helpers/aggregate/summaryaggregate')
const { visualizationAggregate }  = require('../helpers/aggregate/visualizationaggregate')

async function countSectionTop(query, user, callback) {
  try {
    const condition = await topAggregate(query, user)
    const resultCount = await Case.aggregate(condition)
    callback(null, resultCount)
  } catch (e) {
    callback(e, null)
  }
}

async function countSummary(query, user, callback) {
  try {
    const condition = await summaryAggregate(query, user)
    const resultCount = await Case.aggregate(condition)
    callback(null, resultCount)
  } catch (e) {
    callback(e, null)
  }
}

async function countVisualization(query, user, callback) {
  try {
    const condition = await visualizationAggregate(query, user)
    const resultCount = await Case.aggregate(condition)
    callback(null, resultCount)
  } catch (e) {
    callback(e, null)
  }
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
