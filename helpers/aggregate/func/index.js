const sumFunc = (column, value) => {
  return {
    $sum: {
      $cond: [
        {
          $and: [
            { $eq: [column, value] }
          ],
        }, 1, 0]
    }
  }
}

const sumBetweenFunc = (query_state, column, start, end) => {
  return {
    $sum: {
      $cond: [
        { $and: [
          query_state,
          { $gt: [column, start] },
          { $lt: [column, end] }
        ]
      } ,1, 0]
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

const grupFunc = (grouping) => {
  return { $group: { _id: grouping, "total": { $sum: 1 }}}
}

module.exports = {
  sumFunc, grupFunc, sumBetweenFunc, sumWeeklyFunc
}