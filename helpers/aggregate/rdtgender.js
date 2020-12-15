const { searching, filterSplit } = require("./func/filter")
const { sumFuncNoMatch } = require("./func")

const conditionGender = async (query, user) => {
  const search = await searching(query, user)
  const filter = filterSplit(query, 'test_tools', 'final_result', 'tool_tester')
  const male = [{ $eq: ["$gender", "L"] }]
  const female = [{ $eq: ["$gender", "P"] }]
  const conditions = [{ $match: {
    $and: [search, { ...filter }]
    }
  },
    {
      $group: {
        _id: 'gender',
        male: sumFuncNoMatch(male),
        female: sumFuncNoMatch(female)
      },
    }, { $project: { _id: 0 } }
  ]
  return conditions
}

module.exports = {
  conditionGender
}