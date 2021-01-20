const { searching, filterSplit } = require('./func/filter')
const { dateFilter } = require('../filter/date')
const { grupFunc } = require('./func')
const { groupingRdt } = require('./groupaggregate')
const { ROLE } = require('../constant')
const { byRole } = require('./func/filter')
const { districtcities } = require('./func/lookup')

const conditionLocation = async (query, user) => {
  const search = await searching(query, user)
  const filter = filterSplit(query, 'test_tools', 'final_result', 'tool_tester')
  const groups = byRole(ROLE, user)
  const filterDate = dateFilter(query, 'test_date')
  const match = {
    $match: { $and: [search, { ...filter, ...filterDate } ] }
  }
  const conditions = [ match, { ...districtcities },
  {
    $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ '$kota', 0 ] }, '$$ROOT' ] } }
  },
  { '$project' : { 'kota': 0 } },
  {
    '$facet': {
      'summary': [groupingRdt([{...search, ...filter } ], groups)],
      'targets': [grupFunc([ match ], '$target')],
    }
  },
  {
    '$project': {
      'summary': '$summary', 'targets': '$targets'
    }
  }]
  return conditions
}

module.exports = {
  conditionLocation
}