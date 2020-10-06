const { groupingCondition } = require("./groupaggregate")
const { demographicCondition } = require("./demographicaggregate")
const { CRITERIA, WHERE_GLOBAL, ROLE } = require("../constant")
const { searching, byRole } = require("./func/filter")

const summaryAggregate = async (query, user) => {
  const search = await searching(query, user)
  const groups = byRole(ROLE, user)
  const conditions = [
    {
      $match: {
        $and: [ search, { ...WHERE_GLOBAL }]
      }
    },
    {
      $lookup: {
        from: "histories",
        localField: "last_history",
        foreignField: "_id",
        as: "last_history"
      }
    },
    { $unwind: "$last_history" },
    {
      "$facet": {
        "summary": [
          groupingCondition(groups, CRITERIA)
        ],
        "demographic": [
          demographicCondition(groups, query, CRITERIA)
        ]
      }
    },
    {
      "$project": {
        "summary": "$summary",
        "demographic": "$demographic"
      }
    },
  ]
  return conditions
}

module.exports = {
  summaryAggregate
}