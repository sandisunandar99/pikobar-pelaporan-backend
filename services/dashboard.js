const Rdt = require('../models/Rdt')
const Sql = require('../helpers/sectionnumber')
const { conditionGender } = require('../helpers/aggregate/rdtgender')
const { conditionSummary } = require('../helpers/aggregate/rdtaggregate')
const { conditionAge} = require('../helpers/aggregate/rdtage')
const services = 'services.dashboard.'

const summaryInputTest = async (query, user, callback) => {
  try {
    const querySummary = await Sql.summaryInputTest(user, query)
    const result = await Rdt.aggregate(querySummary)
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

const summaryTestResult = async (query, user, callback) => {
  try {
    const queryParam = query
    const condition = await conditionSummary(queryParam, user)
    const resultCount = await Rdt.aggregate(condition)
    verificationData(resultCount, callback)
  } catch (e) {
    callback(e, null)
  }
}

const summaryGender = async (query, user, callback) => {
  try {
    const condition = await conditionGender(query, user)
    const resultCount = await Rdt.aggregate(condition)
    verificationData(resultCount, callback)
  } catch (e) {
    callback(e, null)
  }
}

const summaryAge = async (query, user, callback) => {
  try {
    const condition = await conditionAge(query, user)
    const result = await Rdt.aggregate(condition)
    if (result) {
      return callback(null, result)
    } else {
      return callback(null, 'something wrong')
    }
  } catch (e) {
    callback(e, null)
  }
}

const verificationData = (result, callback) => {
  if (result) {
    return callback(null, result)
  } else {
    return callback(null, 'something wrong')
  }
}

module.exports = [
  {
    name: `${services}summaryInputTest`,method: summaryInputTest
  },
  {
    name: `${services}summaryGender`, method: summaryGender
  },
  {
    name: `${services}summaryAge`, method: summaryAge
  },
  {
    name: `${services}summaryTestResult`, method: summaryTestResult
  }
]