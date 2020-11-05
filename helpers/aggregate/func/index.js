const sumFunc = (query_state, column, value) => {
  return {
    $sum: {
      $cond: [
        {
          $and: [
            query_state,
            { $eq: [column, value] }
          ],
        }, 1, 0]
    }
  }
}

const sumFuncOne = (column, value) => {
  return {
    $sum: {
      $cond: [{
          $and: [
            { $eq: [column, value] }
          ],
        }, 1, 0]
    }
  }
}

const sumFuncTwo = (column, value, column1, value1) => {
  return {
    $sum: {
      $cond: [{
          $and: [
            { $eq: [column, value] },
            { $eq: [column1, value1] }
          ],
        }, 1, 0]
    }
  }
}

const sumBetweenFunc = (query_state, column, start, end) => {
  return {
    $sum: {
      $cond: [
        {
          $and: [
            query_state,
            { $gt: [column, start] },
            { $lt: [column, end] }
          ]
        }, 1, 0]
    }
  }
}

const sumWeeklyFunc = (dateStart, group) => {
  return {
    $cond: [{
      $and: [{
        $gte: ["$createdAt", new Date(new Date(dateStart).setHours(00, 00, 00))]
      },
      { $lt: ["$createdAt", new Date(new Date(dateStart).setHours(23, 59, 59))] }]
    },
      group, ""]
  }
}

const grupFunc = (matchs, grouping) => {
  return {
    $match: matchs
  }, {
    $group: { _id: grouping, "total": { $sum: 1 } }
  }
}

const sumActive = (criteria) => {
  return {
    $sum: {
      $cond: [
        {
          $and: [
            { $eq: ["$final_result", "4"] },
            { $eq: ["$status", criteria] },
            {
              $or: [
                { $in: ["$last_history.current_location_type", ["RUMAH", "RS", "OTHERS"]] }
              ]
            }
          ],
        }, 1, 0]
    }
  }
}

const sumSick = (criteria, type) => {
  let where
  if (Array.isArray(type)) {
    where = { $in: ["$last_history.current_location_type", type] }
  } else {
    where = { $eq: ["$last_history.current_location_type", type] }
  }
  return {
    $sum: {
      $cond: [
        {
          $and: [
            { $eq: ["$final_result", "4"] },
            { $eq: ["$status", criteria] },
            where,
          ]
        }, 1, 0]
    }
  }
}

const sumCondition = (criteria, status) => {
  return {
    $sum: {
      $cond: [
        {
          $and: [
            { $eq: ["$status", criteria] },
            { $eq: ["$final_result", status] }
          ]
        }, 1, 0]
    }
  }
}

module.exports = {
  sumFunc, sumBetweenFunc,
  sumWeeklyFunc, grupFunc,
  sumActive, sumSick, sumCondition,
  sumFuncOne, sumFuncTwo
}