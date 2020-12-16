const { searching, filterSplit } = require('./func/filter')
const { grupFunc } = require('./func')
const { groupingRdt } = require('./groupaggregate')
const { ROLE } = require('../constant')
const { byRole } = require('./func/filter')
const { districtcities } = require('./func/lookup')
const { groupByMonth } = require('./rdtmonth')

const conditionSummary = async (query, user) => {
  const search = await searching(query, user)
  const filter = filterSplit(query, 'test_tools', 'final_result', 'tool_tester')
  const groups = byRole(ROLE, user)
  const conditions = [{
    $match: {
      $and: [search, { ...filter }]
    }
  },
  { ...districtcities },
  {
    $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ '$kota', 0 ] }, '$$ROOT' ] } }
  },
  { '$project' : { 'kota': 0 } },
  {
    '$facet': {
      'month': [groupByMonth()],
      'summary': [groupingRdt(groups)],
      'targets': [grupFunc([search, { ...filter }], '$target')],
    }
  },
  {
    '$project': { 'summary': '$summary', 'targets': '$targets' }
  }]
  return conditions
}

module.exports = {
  conditionSummary
}