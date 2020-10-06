const recapCondition = (grouping, criteria) => {
  const params = {
    $group: {
      _id: grouping,
      confirmed: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", criteria.CONF] }
              ],
            }, 1, 0]
        }
      },
      probable: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", criteria.PROB] },
              ],
            }, 1, 0]
        }
      },
      suspect: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", criteria.SUS] }
              ],
            }, 1, 0]
        }
      },
      closecontact: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", criteria.CLOSE] }
              ],
            }, 1, 0]
        }
      }
    }
  }

  return params
}

module.exports = {
  recapCondition
}