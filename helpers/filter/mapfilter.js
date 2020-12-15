'use strict'
const check = require('../rolecheck')
const filter = require('../filter/casefilter')
const { WHERE_GLOBAL } = require('../constant')
const { filterSplit } = require('../aggregate/func/filter')

const search = async (user, query) => {
  const search = check.countByRole(user)
  const filters = await filter.filterCase(user, query)
  const filterDefault = filterSplit(query, 'status_patient', 'status', 'final_result')
  const searching = {...search, ...filters, ...WHERE_GLOBAL, ...filterDefault }
  return searching
}

module.exports = { search }