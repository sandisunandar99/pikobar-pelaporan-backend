const { countByRole, thisUnitCaseAuthors } = require("../rolecheck")
const { filterCase } = require("../filter/casefilter")
const { groupingCondition } = require("../aggregate/groupaggregate")
const { CRITERIA, WHERE_GLOBAL, ROLE } = require("../constant")

const summaryAggregate = async (query, user) => {
  // If Faskes, retrieve all users in this faskes unit,
  // all users in the same FASKES must have the same summary.
  // ** if only based on author, every an author in this unit(faskes) will be has a different summary)
  const caseAuthors = await thisUnitCaseAuthors(user)
  let searching = {
    ...await filterCase(user, query),
    ...countByRole(user, caseAuthors)
  }

  let groups
  if([ROLE.ADMIN, ROLE.PROVINCE].includes(user.role)){
    groups = { $toUpper : "$address_district_name"}
  }else{
    groups = { $toUpper : "$address_subdistrict_name"}
  }

  const conditions = [
    {
      $match: {
        $and: [ searching, { ...WHERE_GLOBAL }]
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
        "confirmed": [
          await groupingCondition(groups, CRITERIA.CONF)
        ],
        "probable": [
          await groupingCondition(groups, CRITERIA.PROB)
        ],
        "suspect": [
          await groupingCondition(groups, CRITERIA.SUS)
        ],
        "closeContact": [
          await groupingCondition(groups, CRITERIA.CLOSE)
        ],
      }
    },
    {
      "$project": {
        "confirmed": "$confirmed",
        "probable": "$probable",
        "suspect": "$suspect",
        "closeContact": "$closeContact"
      }
    },
  ]
  return conditions
}

module.exports = {
  summaryAggregate
}