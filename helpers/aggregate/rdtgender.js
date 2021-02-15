const { searching, filterSplit } = require("./func/filter")
const { sumFuncNoMatch } = require("./func")
const { dateFilter } = require('../filter/date')

const paramGroup = (match, male, female) => {
  return match,{
    $group: {
      _id: 'gender',
      male: sumFuncNoMatch(male),
      female: sumFuncNoMatch(female)
    }
  }
}

const conditionGender = async (query, user) => {
  const search = await searching(query, user)
  const filter = filterSplit(query, 'test_tools', 'final_result', 'tool_tester')
  const male = [{ $eq: ["$gender", "L"] }]
  const female = [{ $eq: ["$gender", "P"] }]
  const filterDate = dateFilter(query, 'test_date')
  const match = { $match: {
    $and: [search, { ...filter, ...filterDate }]
    }
  }
  const conditions = [ match,
    paramGroup(match, male, female), { $project: { _id: 0 } }
  ]
  return conditions
}

module.exports = {
  conditionGender
}