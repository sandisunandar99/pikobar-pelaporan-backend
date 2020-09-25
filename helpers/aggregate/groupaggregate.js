const groupingCondition = async (grouping, criteria) => {

  const params = {
    $group: {
      _id: grouping,
      active: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$final_result", "4"] },
                { $eq: ["$status", criteria] },
                {
                  $or: [
                    { $in: ["$last_history.current_location_type", ["RUMAH","RS", "OTHERS"]] }
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
                { $eq: ["$status", criteria] },
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
                { $eq: ["$status", criteria] },
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
                { $eq: ["$status", criteria] },
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
                { $eq: ["$status", criteria] },
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