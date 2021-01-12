const { searching, filterSplit } = require('./func/filter')
const { dateFilter } = require('../filter/date')
const { grupFunc } = require('./func')
const { groupingRdt, rdtByMonth } = require('./groupaggregate')
const { ROLE, MONTH } = require('../constant')
const { byRole } = require('./func/filter')
const { districtcities } = require('./func/lookup')

const validationDataMonth = () => {
  const month = MONTH.EN
  let newArray = []

  for (let key in month) {
    let obj = {}
      obj['_id'] = parseInt(key) + parseInt(1)
      obj['name'] = month[key]
      obj['rdt'] = 0
      obj['pcr'] = 0
      newArray.push(obj);
  }

  return newArray
}

const monthProject = {
  $cond: {
    if: { $gt:[{ $size:'$month'}, 1] },
    then: '$month',
    else: validationDataMonth()
  }
}

const conditionSummary = async (query, user) => {
  const search = await searching(query, user)
  const filter = filterSplit(query, 'test_tools', 'final_result', 'tool_tester')
  const groups = byRole(ROLE, user)
  const filterDate = dateFilter(query, 'createdAt')
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
      'month': rdtByMonth(match), 'summary': [groupingRdt([{...search, ...filter } ], groups)],
      'targets': [grupFunc([ match ], '$target')],
    }
  },
  {
    '$project': {
      'month': monthProject, 'summary': '$summary', 'targets': '$targets'
    }
  }]
  return conditions
}

module.exports = {
  conditionSummary
}