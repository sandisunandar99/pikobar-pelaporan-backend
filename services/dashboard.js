const Rdt = require('../models/Rdt')
const Sql = require('../helpers/sectionnumber')

const summaryInputTest = async (query, user, callback) =>{
  try {
   let querySummary = await Sql.summaryInputTest(user, query)
   let result = await Rdt.aggregate(querySummary)
   callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: "services.dashboard.summaryInputTest",
    method: summaryInputTest
  }
]