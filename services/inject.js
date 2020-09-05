const Case = require('../models/Case')
const History = require('../models/History')

const lastHistory = async (query, callback) => {
  try {
    const result = await Case.find({
      delete_status: { $ne: "deleted" },
      last_history: { $exists: false }
    })
    .select(["status", "stage", "final_result"])
    .sort({_id:-1})
    result.map(async res => {
      const bodys = {
        case: res._id,
        status: res.status,
        stage: res.stage,
        final_result: res.final_result,
        current_location_type: 'OTHERS'
      }
      const saveHistory = await History.create(bodys)
      await Case.findOneAndUpdate({ _id: saveHistory.case }, {
        last_history: saveHistory._id
      }, { upsert: true })
    })
    callback(null, result.length)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.inject.lastHistory',
    method: lastHistory
  }
];

