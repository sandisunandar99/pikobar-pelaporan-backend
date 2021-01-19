const { searching, filterSplit } = require('./func/filter')
const { sumBetweenFunc } = require('./func')
const { dateFilter } = require('../filter/date')

const converts = { $convert:{ input: '$age', to: 'int' } }

const paramGroup = (group, value) => {
  return {
    $group: {
      _id: group,
      zero_ten: sumBetweenFunc({ $eq: ["$gender", value] }, converts, -1, 11),
      ten_twenty: sumBetweenFunc({ $eq: ["$gender", value] }, converts, 11, 21),
      twenty_thirty: sumBetweenFunc({ $eq: ["$gender", value] }, converts, 21, 31),
      thirty_forty: sumBetweenFunc({ $eq: ["$gender", value] }, converts, 31, 41),
      forty_fifty: sumBetweenFunc({ $eq: ["$gender", value] }, converts, 41, 51),
      fifty_sixty: sumBetweenFunc({ $eq: ["$gender", value] }, converts, 51, 61),
      sixty_seventy: sumBetweenFunc({ $eq: ["$gender", value] }, converts, 61, 71),
      seventy_eighty: sumBetweenFunc({ $eq: ["$gender", value] }, converts, 71, 81),
      eighty_ninety: sumBetweenFunc({ $eq: ["$gender", value] }, converts, 81, 91),
      ninety_hundred: sumBetweenFunc({ $eq: ["$gender", value] }, converts, 91, 101),
    }
  }
}

const conditionAge = async (query, user) => {
  const search = await searching(query, user)
  const filter = filterSplit(query, 'test_tools', 'final_result', 'tool_tester')
  const filterDate = dateFilter(query, 'createdAt')
  const conditions = [{
    $match: {
      $and: [search, { ...filter, ...filterDate }]
    }
  },
  {
    '$facet': {
      'male': [paramGroup('male', 'L')],
      'female': [paramGroup('female', 'P')]
    }
  },
  {
    '$project': {
      'male': '$male',
      'female': '$female'
    }
  },
  ]
  return conditions
}

module.exports = {
  conditionAge
}