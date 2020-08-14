const Case = require('../models/Case')
const maps = require('../helpers/filter/mapfilter')
const { PATIENT_STATUS } = require('../helpers/constant')

const listMap = async (query, user, callback) => {
  try {
    const aggregateWhere = await maps.aggregateCondition(user, query)
    const result = await Case.aggregate(aggregateWhere)
    result.map(res => {
      let finalResult
      if (res.final_result === "1") {
        finalResult = PATIENT_STATUS.DONE
      } else if (res.final_result === "2") {
        finalResult = PATIENT_STATUS.DEAD
      } else if (res.final_result === "3") {
        finalResult = PATIENT_STATUS.DISCARDED
      } else if (res.final_result === "4") {
        finalResult = PATIENT_STATUS.SICK
      } else if (res.final_result === "5") {
        finalResult = PATIENT_STATUS.QUARANTINED
      } else if (res.final_result === '' || res.final_result === null || res.final_result === "0") {
        finalResult = PATIENT_STATUS.NEGATIVE
      } else {
        finalResult = ''
      }
      res.final_result = finalResult
    })
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name:'services.map.listMap',
    method:listMap
  }
];

