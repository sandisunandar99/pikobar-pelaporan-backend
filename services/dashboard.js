const Rdt = require('../models/Rdt')
const Sql = require('../helpers/sectionnumber')
const { CRITERIA } = require('../helpers/constant')
const { conditionGender } = require('../helpers/aggregate/rdtgender')
const { conditionSummary } = require('../helpers/aggregate/rdtaggregate')
const { conditionAge } = require('../helpers/aggregate/rdtage')
const { conditionLocation } = require('../helpers/aggregate/rdtlocation')
const servicesInput = 'services.dashboard.summaryInputTest'
const servicesResult = 'services.dashboard.summaryTestResult'
const servicesLocation = 'services.dashboard.summaryTestResultLocation'
const servicesGender = 'services.dashboard.summaryGender'
const servicesAge = 'services.dashboard.summaryAge'
const { clientConfig } = require('../config/redis')
const { keyDashboard } = require('../helpers/filter/redis')
const logs = require('../helpers/log')

const keyAndExpireTime = (query, user, name) => {
  const { key, expireTime } = keyDashboard(query, user, 10, name)

  return { key, expireTime }
}

const summaryInputTest = async (query, user, callback) => {
  const get = keyAndExpireTime(query, user, 'summary-input-test')
  try {
    clientConfig.get(get.key, async (err, result) => {
      if(result){
        logs.logInfo(callback, 'redis', JSON.parse(result), get.key)
      }else{
        const querySummary = Sql.summaryInputTest(user, query)
        const result = await Rdt.aggregate(querySummary)
        result.map(r => r.date_version = new Date().toISOString())
        clientConfig.setex(get.key, get.expireTime, JSON.stringify(result)) // set redis get.key
        logs.logInfo(callback, 'api', result, get.key)
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

const summaryTestResult = async (query, user, callback) => {
  const get = keyAndExpireTime(query, user, 'summary-test-result')
  try {
    clientConfig.get(get.key, async (err, result) => {
      if(result){
        logs.logInfo(callback, 'redis', JSON.parse(result), get.key)
      }else{
        const condition = await conditionSummary(query, user)
        const result = await Rdt.aggregate(condition)
        result.map(r => r.date_version = new Date().toISOString())
        clientConfig.setex(get.key, get.expireTime, JSON.stringify(result)) // set redis key
        logs.logInfo(callback, 'api', JSON.parse(result), get.key)
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

const loopFilter = (i) => {
  if (i._id === CRITERIA.CLOSE){
    i._id = CRITERIA.CLOSE_ID
  }
  if (i._id === CRITERIA.SUS){
    i._id = CRITERIA.SUS_ID
  }
  if (i._id === CRITERIA.PROB){
    i._id = CRITERIA.PROB_ID
  }
  if (i._id === CRITERIA.CONF){
    i._id = CRITERIA.CONF_ID
  }
  return i
}

const summaryTestResultLocation = async (query, user, callback) => {
  const { key, expireTime } = keyAndExpireTime(query, user, 'summary-test-result-location')
  try {
    clientConfig.get(key, async (err, result) => {
      if(result){
        logs.logInfo(callback, 'redis', JSON.parse(result), key)
      }else{
        const condition = await conditionLocation(query, user)
        const resultCount = await Rdt.aggregate(condition)
        const manipulateData = resultCount.map((row) => {
          row.targets.map((i) => {
            loopFilter(i)
          })
          return row
        })
        manipulateData.map(r => r.date_version = new Date().toISOString())
        clientConfig.setex(key, expireTime, JSON.stringify(manipulateData)) // set redis key
        logs.logInfo(callback, 'api', manipulateData, key)
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

const summaryGender = async (query, user, callback) => {
  const { key, expireTime } = keyAndExpireTime(query, user, 'summary-test-result-gender')
  try {
    clientConfig.get(key, async (err, result) => {
      if(result){
        logs.logInfo(callback, 'redis', JSON.parse(result), key)
      }else{
        const queryParam = query
        const userParam = user
        const condition = await conditionGender(queryParam, userParam)
        const result = await Rdt.aggregate(condition)
        result.map(r => r.date_version = new Date().toISOString())
        clientConfig.setex(key, expireTime, JSON.stringify(result)) // set redis key
        logs.logInfo(callback, 'api', result, key)
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

const summaryAge = async (query, user, callback) => {
  const { key, expireTime } = keyDashboard(query, user, 10, 'summary-test-result-age')
  try {
    clientConfig.get(key, async (err, result) => {
      if(result){
        logs.logInfo(callback, 'redis', JSON.parse(result), key)
      }else{
        const condition = await conditionAge(query, user)
        const result = await Rdt.aggregate(condition)
        result.map(r => r.date_version = new Date().toISOString())
        clientConfig.setex(key, expireTime, JSON.stringify(result)) // set redis key
        logs.logInfo(callback, 'api', result, key)
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  { name: servicesInput ,method: summaryInputTest },
  { name: servicesResult, method: summaryTestResult},
  { name: servicesLocation, method: summaryTestResultLocation},
  { name: servicesGender, method: summaryGender },
  { name: servicesAge, method: summaryAge },
]