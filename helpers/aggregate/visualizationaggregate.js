const visualizationCondition = async (grouping, criteria) => {

  const params = {
    $group: {
      _id: grouping,
      confirmed: {
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
      probable: {
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
      suspect: {
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
      closecontact: {
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
      }
    }
  }

  return params
}

module.exports = {
  visualizationCondition
}