const { searching, filterSplit } = require('./func/filter')
const { dateFilter } = require('../filter/date')
const { byMonth, byMonthRdt, byMonthPcr } = require('./groupaggregate')
const { MONTH } = require('../constant')

const month = MONTH.EN
let newArray = []
let newArrayRdt = []
let newArrayPcr = []

const validationDataMonth = () => {
  for (let key in month) {
    let obj = {}
    let objRdt = {}
    let objPcr = {}
    obj['_id'] = parseInt(key) + parseInt(1)
    obj['name'] = month[key]
    obj['rdt'] = 0
    obj['pcr'] = 0
    newArray.push(obj)
    objRdt['_id'] = parseInt(key) + parseInt(1)
    objRdt['name'] = month[key]
    objRdt['reaktif'] = 0
    objRdt['non_reaktif'] = 0
    objRdt['inkonkuslif'] = 0
    newArrayRdt.push(objRdt)
    objPcr['_id'] = parseInt(key) + parseInt(1)
    objPcr['name'] = month[key]
    objPcr['positif'] = 0
    objPcr['negatif'] = 0
    objPcr['invalid'] = 0
    newArrayPcr.push(objPcr)
  }
  return {
    'months' : filteredArr(newArray), 'monthrdt': filteredArr(newArrayRdt), 'monthpcr': filteredArr(newArrayPcr)
  }
}

const filteredArr = (data) => {
  return data.reduce((acc, current) => {
    const x = acc.find(item => item._id === current._id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [])
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