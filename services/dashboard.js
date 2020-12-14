const Rdt = require('../models/Rdt')
const Sql = require('../helpers/sectionnumber')
const { conditionGender } = require('../helpers/aggregate/rdtgender')
const { conditionAge} = require('../helpers/aggregate/rdtage')

const summaryInputTest = async (query, user, callback) => {
  try {
    const querySummary = await Sql.summaryInputTest(user, query)
    const result = await Rdt.aggregate(querySummary)
    callback(null, result)
  } catch (error) {
    callback(error, null)
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
    const resultCount = await Rdt.aggregate(condition)
    verificationData(resultCount, callback)
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
    name: "services.dashboard.summaryInputTest",
    method: summaryInputTest
  }, {
    name: "services.dashboard.summaryGender",
    method: summaryGender
  }, {
    name: "services.dashboard.summaryAge",
    method: summaryAge
  }
]