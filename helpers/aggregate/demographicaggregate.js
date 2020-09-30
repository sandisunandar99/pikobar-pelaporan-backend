const demographicCondition = (grouping, query) => {
  let query_state
  if (query.criteria){
    query_state = { $eq: ["$status", query.criteria] }
  }else{
    query_state = {}
  }
  const params = {
    $group: {
      _id: grouping,
      wni: {
        $sum: {
          $cond: [
            {
              $and: [
                query_state,
                { $eq: ["$nationality", "WNI"] }
              ],
            }, 1, 0]
        }
      },wna: {
        $sum: {
          $cond: [
            {
              $and: [
                query_state,
                { $eq: ["$nationality", "WNA"] }
              ],
            }, 1, 0]
        }
      },male: {
        $sum: {
          $cond: [
            {
              $and: [
                query_state,
                { $eq: ["$gender", "L"] }
              ],
            }, 1, 0]
        }
      },female: {
        $sum: {
          $cond: [
            {
              $and: [
                query_state,
                { $eq: ["$nationality", "P"] }
              ],
            }, 1, 0]
        }
      },under_five: {
        $sum: {
          $cond: [
            { $and: [
              query_state,
              { $gt: ["$age", 0 ] },
              { $lt: ["$age", 6] }
            ]
          } ,1, 0]
        }
      }
    }
  }

  return params
}

module.exports = {
  demographicCondition
}