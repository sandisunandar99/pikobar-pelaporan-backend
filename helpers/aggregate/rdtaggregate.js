const { searching, filterSplit } = require('./func/filter')
const { dateFilter } = require('../filter/date')
const { byMonth, byMonthRdt, byMonthPcr } = require('./groupaggregate')
const { MONTH } = require('../constant')

const validationDataMonth = () => {
  const month = MONTH.EN
  let newArray = []
  let newArrayRdt = []
  let newArrayPcr = []

  for (let key in month) {
    let obj = {}
      obj['_id'] = parseInt(key) + parseInt(1)
      obj['name'] = month[key]
      obj['rdt'] = 0
      obj['pcr'] = 0
      newArray.push(obj);
  }

  for (let key in month) {
    let obj = {}
      obj['_id'] = parseInt(key) + parseInt(1)
      obj['name'] = month[key]
      obj['reaktif'] = 0
      obj['non_reaktif'] = 0
      obj['inkonkuslif'] = 0
      newArrayRdt.push(obj);
  }

  for (let key in month) {
    let obj = {}
      obj['_id'] = parseInt(key) + parseInt(1)
      obj['name'] = month[key]
      obj['positif'] = 0
      obj['negatif'] = 0
      obj['invalid'] = 0
      newArrayPcr.push(obj);
  }

  return {
    'months' : newArray,
    'monthrdt': newArrayRdt,
    'monthpcr': newArrayPcr
  }
}

const monthProject = (month, condition) => {
  return {
      $cond: {
      if: { $gt: [{ $size:month}, 1] },
      then: month,
      else: validationDataMonth()[condition]
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
      'month_pcr': byMonthPcr(match, 'PCR')
    }
  },
  {
    '$project': {
      'month': monthProject('$month', 'months'),
      'month_rdt': monthProject('$month_rdt', 'monthrdt'),
      'month_pcr': monthProject('$month_pcr', 'monthpcr')
    }
  }]
  return conditions
}

module.exports = {
  conditionSummary
}