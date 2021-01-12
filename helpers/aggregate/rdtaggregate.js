const { searching, filterSplit } = require('./func/filter')
const { dateFilter } = require('../filter/date')
const { byMonth, byMonthRdt } = require('./groupaggregate')
const { MONTH } = require('../constant')

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

const monthProject = (month) => {
  return {
      $cond: {
      if: { $gt:[{ $size:month}, 1] },
      then: month,
      else: validationDataMonth()
    }
  }
}

const conditionSummary = async (query, user) => {
  const search = await searching(query, user)
  const filter = filterSplit(query, 'test_tools', 'final_result', 'tool_tester')
  const filterDate = dateFilter(query, 'createdAt')
  const match = {
    $match: { $and: [search, { ...filter, ...filterDate } ] }
  }
  const conditions = [
  {
    '$facet': {
      'month': byMonth(match),
      'month_rdt': byMonthRdt(match, 'RDT'),
      'month_pcr': byMonthRdt(match, 'PCR')
    }
  },
  {
    '$project': {
      'month': monthProject('$month'),
      'month_rdt': monthProject('$month_rdt'),
      'month_pcr': monthProject('$month_pcr')
    }
  }]
  return conditions
}

module.exports = {
  conditionSummary
}