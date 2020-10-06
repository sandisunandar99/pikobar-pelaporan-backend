const { matchWhere } = require("./globalcondtion")
const { dateGrouping } = require("./globalcondtion")
const weeklyCondition = (query, searching, where, criteria) => {
  let matchs = matchWhere(query, searching, where, criteria)
  const dateGroup = dateGrouping()
  const paramsWeekly = [
    matchs,
    {
      $project: {
        "weekly": {
          $concat: [
            {
              $cond: [{
                $and: [{
                  $gte: ["$createdAt", new Date(new Date(dateGroup.date_one).setHours(00, 00, 00))]
                },
                { $lt: ["$createdAt", new Date(new Date(dateGroup.date_one).setHours(23, 59, 59))] }]
              },
                "date_one", ""]
            }, {
              $cond: [{
                $and: [{
                  $gte: ["$createdAt", new Date(new Date(dateGroup.date_two).setHours(00, 00, 00))]
                },
                { $lt: ["$createdAt", new Date(new Date(dateGroup.date_two).setHours(23, 59, 59))] }]
              },
                "date_two", ""]
            }, {
              $cond: [{
                $and: [{
                  $gte: ["$createdAt", new Date(new Date(dateGroup.date_tree).setHours(00, 00, 00))]
                },
                { $lt: ["$createdAt", new Date(new Date(dateGroup.date_tree).setHours(23, 59, 59))] }]
              },
                "date_tree", ""]
            }, {
              $cond: [{
                $and: [{
                  $gte: ["$createdAt", new Date(new Date(dateGroup.date_four).setHours(00, 00, 00))]
                },
                { $lt: ["$createdAt", new Date(new Date(dateGroup.date_four).setHours(23, 59, 59))] }]
              },
                "date_four", ""]
            }, {
              $cond: [{
                $and: [{
                  $gte: ["$createdAt", new Date(new Date(dateGroup.date_five).setHours(00, 00, 00))]
                },
                { $lt: ["$createdAt", new Date(new Date(dateGroup.date_five).setHours(23, 59, 59))] }]
              },
                "date_five", ""]
            }, {
              $cond: [{
                $and: [{
                  $gte: ["$createdAt", new Date(new Date(dateGroup.date_six).setHours(00, 00, 00))]
                },
                { $lt: ["$createdAt", new Date(new Date(dateGroup.date_six).setHours(23, 59, 59))] }]
              },
                "date_six", ""]
            }, {
              $cond: [{
                $and: [{
                  $gte: ["$createdAt", new Date(new Date(dateGroup.date_seven).setHours(00, 00, 00))]
                },
                { $lt: ["$createdAt", new Date(new Date(dateGroup.date_seven).setHours(23, 59, 59))] }]
              },
                "date_seven", ""]
            }
          ]
        }
      }
    },
    {
      $group: {
        "_id": "$weekly",
        count: {
          $sum: 1
        }
      }
    }
  ]

  return paramsWeekly
}

module.exports = {
  weeklyCondition
}