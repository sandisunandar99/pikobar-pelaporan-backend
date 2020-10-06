const { countByRole, thisUnitCaseAuthors } = require("../rolecheck")
const { filterCase } = require("../filter/casefilter")
const { recapCondition } = require("./recapaggregate")
const { groupCondition } = require("./genderaggregate")
const { ageCondition } = require("./ageaggregate")
const { weeklyCondition } = require("./weeklyaggregate")
const { CRITERIA, WHERE_GLOBAL, ROLE } = require("../constant")
const { dateReplace } = require("../custom")

const visualizationAggregate = async (query, user) => {
  // If Faskes, retrieve all users in this faskes unit,
  // all users in the same FASKES must have the same visualization.
  // ** if only based on author, every an author in this unit(faskes) will be has a different visualization)
  const caseAuthors = await thisUnitCaseAuthors(user)
  let resultFilter = {}
  if (query.start_date) {
    let searchDate = dateReplace(query.start_date)
    resultFilter = {
      "createdAt": {
        "$gte": new Date(new Date(searchDate).setHours(00, 00, 00)),
        "$lt": new Date(new Date(searchDate).setHours(23, 59, 59))
      }
    }
  } else {
    resultFilter
  }

  let searching = {
    ...await filterCase(user, query),
    ...countByRole(user, caseAuthors),
    ...resultFilter
  }

  let groups
  if ([ROLE.ADMIN, ROLE.PROVINCE].includes(user.role)) {
    groups = { $toUpper: "$address_district_name" }
  } else {
    groups = { $toUpper: "$address_subdistrict_name" }
  }

  const conditions = [
    {
      $match: {
        $and: [searching, { ...WHERE_GLOBAL }]
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