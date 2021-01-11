const { searching, filterSplit } = require('./func/filter')
const { grupFunc } = require('./func')
const { groupingRdt, rdtByMonth } = require('./groupaggregate')
const { ROLE } = require('../constant')
const { byRole } = require('./func/filter')
const { districtcities } = require('./func/lookup')

const validationDataMonth = () => {
  let newArray = []

  for (i = 1; i < 13; i++) {
    let obj = {}
      obj['_id'] = i
      obj['rdt'] = 0
      obj['pcr'] = 0
      newArray.push(obj);
  }

  return newArray
}

const monthProject = {
  $cond: {
    if: { $gt:[{ $size:"$month"}, 1] },
    then: '$month',
    else: validationDataMonth()
  }
}

const conditionSummary = async (query, user) => {
  const search = await searching(query, user)
  const filter = filterSplit(query, 'test_tools', 'final_result', 'tool_tester')
  const groups = byRole(ROLE, user)
  const conditions = [{
    $match: { $and: [search, { ...filter }] }
  },
  { ...districtcities },
  {
    $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ '$kota', 0 ] }, '$$ROOT' ] } }
  },
  { '$project' : { 'kota': 0 } },
  {
    '$facet': {
      'month': rdtByMonth(),
      'summary': [groupingRdt(groups)],
      'targets': [grupFunc([search, { ...filter }], '$target')],
    }
  },
  {
    '$project': {
      'month': monthProject, 'summary': '$summary',
      'targets': '$targets'
    }
  }]
  return conditions
}

module.exports = {
  conditionSummary
}