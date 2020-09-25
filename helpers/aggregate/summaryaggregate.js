const { countByRole, thisUnitCaseAuthors } = require("../rolecheck")
const { filterCase } = require("../filter/casefilter")
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

  let grouping
  if([ROLE.ADMIN, ROLE.PROVINCE].includes(user.role)){
    grouping = { $toUpper : "$address_district_name"}
  }else{
    grouping = { $toUpper : "$address_subdistrict_name"}
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
          {
            $group: {
              _id: grouping,
              active: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$final_result", "4"] },
                        { $eq: ["$status", CRITERIA.CONF] },
                        {
                          $or: [
                            { $eq: ["$last_history.current_location_type", "RUMAH"] },
                            { $in: ["$last_history.current_location_type", ["RS", "OTHERS"]] }
                          ]
                        }
                      ],
                    }, 1, 0]
                }
              },
              sick_home: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$final_result", "4"] },
                        { $eq: ["$status", CRITERIA.CONF] },
                        { $eq: ["$last_history.current_location_type", "RUMAH"] },
                      ]
                    }, 1, 0]
                }
              },
              sick_hospital: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$final_result", "4"] },
                        { $eq: ["$status", CRITERIA.CONF] },
                        { $in: ["$last_history.current_location_type", ["RS", "OTHERS"]] }
                      ]
                    }, 1, 0]
                }
              },
              recovered: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status", CRITERIA.CONF] },
                        { $eq: ["$final_result", "1"] }
                      ]
                    }, 1, 0]
                }
              },
              decease: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status", CRITERIA.CONF] },
                        { $eq: ["$final_result", "2"] }
                      ]
                    }, 1, 0]
                }
              }
            }
          }
        ],
        "probable": [
          {
            $group: {
              _id: grouping,
              active: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$final_result", "4"] },
                        { $eq: ["$status", CRITERIA.PROB] },
                        {
                          $or: [
                            { $eq: ["$last_history.current_location_type", "RUMAH"] },
                            { $in: ["$last_history.current_location_type", ["RS", "OTHERS"]] }
                          ]
                        }
                      ],
                    }, 1, 0]
                }
              },
              sick_home: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$final_result", "4"] },
                        { $eq: ["$status", CRITERIA.PROB] },
                        { $eq: ["$last_history.current_location_type", "RUMAH"] },
                      ]
                    }, 1, 0]
                }
              },
              sick_hospital: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$final_result", "4"] },
                        { $eq: ["$status", CRITERIA.PROB] },
                        { $in: ["$last_history.current_location_type", ["RS", "OTHERS"]] }
                      ]
                    }, 1, 0]
                }
              },
              recovered: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status", CRITERIA.PROB] },
                        { $eq: ["$final_result", "1"] }
                      ]
                    }, 1, 0]
                }
              },
              decease: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status", CRITERIA.PROB] },
                        { $eq: ["$final_result", "2"] }
                      ]
                    }, 1, 0]
                }
              }
            }
          }
        ],
        "suspect": [
          {
            $group: {
              _id: grouping,
              active: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$final_result", "4"] },
                        { $eq: ["$status", CRITERIA.SUS] },
                        {
                          $or: [
                            { $eq: ["$last_history.current_location_type", "RUMAH"] },
                            { $in: ["$last_history.current_location_type", ["RS", "OTHERS"]] }
                          ]
                        }
                      ],
                    }, 1, 0]
                }
              },
              sick_home: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$final_result", "4"] },
                        { $eq: ["$status", CRITERIA.SUS] },
                        { $eq: ["$last_history.current_location_type", "RUMAH"] },
                      ]
                    }, 1, 0]
                }
              },
              sick_hospital: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$final_result", "4"] },
                        { $eq: ["$status", CRITERIA.SUS] },
                        { $in: ["$last_history.current_location_type", ["RS", "OTHERS"]] }
                      ]
                    }, 1, 0]
                }
              },
              recovered: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status", CRITERIA.SUS] },
                        { $eq: ["$final_result", "1"] }
                      ]
                    }, 1, 0]
                }
              },
              decease: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status", CRITERIA.SUS] },
                        { $eq: ["$final_result", "2"] }
                      ]
                    }, 1, 0]
                }
              }
            }
          }
        ],
        "closeContact": [
          {
            $group: {
              _id: grouping,
              active: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$final_result", "4"] },
                        { $eq: ["$status", CRITERIA.CLOSE] },
                        {
                          $or: [
                            { $eq: ["$last_history.current_location_type", "RUMAH"] },
                            { $in: ["$last_history.current_location_type", ["RS", "OTHERS"]] }
                          ]
                        }
                      ],
                    }, 1, 0]
                }
              },
              sick_home: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$final_result", "4"] },
                        { $eq: ["$status", CRITERIA.CLOSE] },
                        { $eq: ["$last_history.current_location_type", "RUMAH"] },
                      ]
                    }, 1, 0]
                }
              },
              sick_hospital: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$final_result", "4"] },
                        { $eq: ["$status", CRITERIA.CLOSE] },
                        { $in: ["$last_history.current_location_type", ["RS", "OTHERS"]] }
                      ]
                    }, 1, 0]
                }
              },
              recovered: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status", CRITERIA.CLOSE] },
                        { $eq: ["$final_result", "1"] }
                      ]
                    }, 1, 0]
                }
              },
              decease: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status", CRITERIA.CLOSE] },
                        { $eq: ["$final_result", "2"] }
                      ]
                    }, 1, 0]
                }
              }
            }
          }
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