const { recapCondition } = require("./recapaggregate")
const { groupCondition } = require("./genderaggregate")
const { ageCondition } = require("./ageaggregate")
const { weeklyCondition } = require("./weeklyaggregate")
const { CRITERIA, WHERE_GLOBAL, ROLE } = require("../constant")
const { searching, byRole } = require("./func/filter")

const visualizationAggregate = async (query, user) => {
  const search = await searching(query, user)
  const groups = byRole(ROLE, user)
  const conditions = [
    {
      $match: {
        $and: [search, { ...WHERE_GLOBAL }]
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
        "visualization": [recapCondition(groups, CRITERIA)],
        "date_weekly": weeklyCondition(query, searching, WHERE_GLOBAL, CRITERIA),
        "age": ageCondition(query, searching, WHERE_GLOBAL, CRITERIA),
        "gender": groupCondition(query, searching, WHERE_GLOBAL, CRITERIA).gender,
        "nationality": groupCondition(query, searching, WHERE_GLOBAL, CRITERIA).nationality
      }
    },
    {
      "$project": {
        "visualization": "$visualization",
        "date_weekly": "$date_weekly",
        "age": "$age",
        "gender": "$gender",
        "nationality": "$nationality"
      }
    },
  ]
  return conditions
}

module.exports = {
  visualizationAggregate
}