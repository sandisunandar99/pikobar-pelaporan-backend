const groupByMonth = () => {
  return [
    {
      $match: {
        createdAt: {
          "$gte": new Date('2020-01-01'),
          "$lt": new Date('2020-12-31')
        }
      }
    },
    {
      "$project": {
        "name": 1,
        "month": { "$month": "$createdAt" }
      }
    },
    {
      "$group": {
        "_id": "$month",
        "total": { "$sum": 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]
}

module.exports = { groupByMonth }