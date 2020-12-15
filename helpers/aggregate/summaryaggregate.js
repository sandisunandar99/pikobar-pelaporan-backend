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
    { $unwind: {
        path: "$last_history",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "districtcities",
        localField: "address_district_code",
        foreignField: "kemendagri_kabupaten_kode",
        as: "kota"
      }
    },
    {
        $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$kota", 0 ] }, "$$ROOT" ] } }
    },
    {
      "$project" : {
          "kota": 0,
      }
    },
    {
      "$facet": {
        "summary": [
          groupingCondition(groups, query, CRITERIA)
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