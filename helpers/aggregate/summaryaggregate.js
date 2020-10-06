const { countByRole, thisUnitCaseAuthors } = require("../rolecheck")
const { filterCase } = require("../filter/casefilter")
const { groupingCondition } = require("./groupaggregate")
const { demographicCondition } = require("./demographicaggregate")
const { CRITERIA, WHERE_GLOBAL, ROLE } = require("../constant")

const summaryAggregate = async (query, user) => {
  // If Faskes, retrieve all users in this faskes unit,
  // all users in the same FASKES must have the same summary.
  // ** if only based on author, every an author in this unit(faskes) will be has a different summary)
  const caseAuthors = await thisUnitCaseAuthors(user)
  let resultFilter = {}
  let searchRegExp = new RegExp('/', 'g')
  if (query.start_date){
    let queryDate = query.start_date
    let searchDate = queryDate.replace(searchRegExp, '-')
    resultFilter = {
      "createdAt":{
        "$gte": new Date(new Date(searchDate).setHours(00, 00, 00)),
        "$lt": new Date(new Date(searchDate).setHours(23, 59, 59))
      }
    }
  }else{
    resultFilter
  }

  let searching = {
    ...await filterCase(user, query),
    ...countByRole(user, caseAuthors),
    ...resultFilter
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