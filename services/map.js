const Case = require('../models/Case')
const maps = require('../helpers/filter/mapfilter')

const listMap = async (query, user, callback) => {
  try {
    const aggregateWhere = await maps.aggregateCondition(user, query)
    const result = await Case.aggregate(aggregateWhere)
    result.map(res => {
      let finalResult
      if (res.final_result === "1") {
        finalResult = 'Selesai Isolasi/Sembuh'
      } else if (res.final_result === "2") {
        finalResult = 'Meninggal'
      } else if (res.final_result === "3") {
        finalResult = 'Discarded'
      } else if (res.final_result === "4") {
        finalResult = 'Masih Sakit'
      } else if (res.final_result === "5") {
        finalResult = 'Masih Dikarantina'
      } else if (res.final_result === '' || res.final_result === null || res.final_result === "0") {
        finalResult = 'Negatif'
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

