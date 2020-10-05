const groupingCondition = (grouping, criteria) => {

  const params = {
    $group: {
      _id: grouping,
      confrimed_active: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$final_result", "4"] },
                { $eq: ["$status", criteria.CONF] },
                {
                  $or: [
                    { $in: ["$last_history.current_location_type", ["RUMAH","RS", "OTHERS"]] }
                  ]
                }
              ],
            }, 1, 0]
        }
      },
      confrimed_sick_home: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$final_result", "4"] },
                { $eq: ["$status", criteria.CONF] },
                { $eq: ["$last_history.current_location_type", "RUMAH"] },
              ]
            }, 1, 0]
        }
      },
      confrimed_sick_hospital: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$final_result", "4"] },
                { $eq: ["$status", criteria.CONF] },
                { $in: ["$last_history.current_location_type", ["RS", "OTHERS"]] }
              ]
            }, 1, 0]
        }
      },
      confrimed_recovered: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", criteria.CONF] },
                { $eq: ["$final_result", "1"] }
              ]
            }, 1, 0]
        }
      },
      confrimed_decease: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", criteria.CONF] },
                { $eq: ["$final_result", "2"] }
              ]
            }, 1, 0]
        }
      },
      probable_active: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$final_result", "4"] },
                { $eq: ["$status", criteria.PROB] },
                {
                  $or: [
                    { $in: ["$last_history.current_location_type", ["RUMAH","RS", "OTHERS"]] }
                  ]
                }
              ],
            }, 1, 0]
        }
      },
      probable_sick_home: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$final_result", "4"] },
                { $eq: ["$status", criteria.PROB] },
                { $eq: ["$last_history.current_location_type", "RUMAH"] },
              ]
            }, 1, 0]
        }
      },
      probable_sick_hospital: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$final_result", "4"] },
                { $eq: ["$status", criteria.PROB] },
                { $in: ["$last_history.current_location_type", ["RS", "OTHERS"]] }
              ]
            }, 1, 0]
        }
      },
      probable_recovered: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", criteria.PROB] },
                { $eq: ["$final_result", "1"] }
              ]
            }, 1, 0]
        }
      },
      probable_decease: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", criteria.PROB] },
                { $eq: ["$final_result", "2"] }
              ]
            }, 1, 0]
        }
      },
      suspect_active: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$final_result", "4"] },
                { $eq: ["$status", criteria.SUS] },
                {
                  $or: [
                    { $in: ["$last_history.current_location_type", ["RUMAH","RS", "OTHERS"]] }
                  ]
                }
              ],
            }, 1, 0]
        }
      },
      suspect_sick_home: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$final_result", "4"] },
                { $eq: ["$status", criteria.SUS] },
                { $eq: ["$last_history.current_location_type", "RUMAH"] },
              ]
            }, 1, 0]
        }
      },
      suspect_sick_hospital: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$final_result", "4"] },
                { $eq: ["$status", criteria.SUS] },
                { $in: ["$last_history.current_location_type", ["RS", "OTHERS"]] }
              ]
            }, 1, 0]
        }
      },
      suspect_recovered: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", criteria.SUS] },
                { $eq: ["$final_result", "1"] }
              ]
            }, 1, 0]
        }
      },
      suspect_decease: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", criteria.SUS] },
                { $eq: ["$final_result", "2"] }
              ]
            }, 1, 0]
        }
      },
      closecontact_active: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$final_result", "4"] },
                { $eq: ["$status", criteria.CLOSE] },
                {
                  $or: [
                    { $in: ["$last_history.current_location_type", ["RUMAH","RS", "OTHERS"]] }
                  ]
                }
              ],
            }, 1, 0]
        }
      },
      closecontact_sick_home: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$final_result", "4"] },
                { $eq: ["$status", criteria.CLOSE] },
                { $eq: ["$last_history.current_location_type", "RUMAH"] },
              ]
            }, 1, 0]
        }
      },
      closecontact_sick_hospital: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$final_result", "4"] },
                { $eq: ["$status", criteria.CLOSE] },
                { $in: ["$last_history.current_location_type", ["RS", "OTHERS"]] }
              ]
            }, 1, 0]
        }
      },
      closecontact_recovered: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", criteria.CLOSE] },
                { $eq: ["$final_result", "1"] }
              ]
            }, 1, 0]
        }
      },
      closecontact_decease: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", criteria.CLOSE] },
                { $eq: ["$final_result", "2"] }
              ]
            }, 1, 0]
        }
      }
    }
  }

  return params
}

module.exports = {
  groupingCondition
}