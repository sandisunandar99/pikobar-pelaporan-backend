'use strict'
const check = require('../rolecheck')
const filter = require('../filter/casefilter')
const { WHERE_GLOBAL } = require('../constant')

const search = async (user, query) => {
  const search = check.countByRole(user)
  const filters = await filter.filterCase(user, query)
  const searching = {...search, ...filters, ...WHERE_GLOBAL, ...filterDefault(query) }
  return searching
}

const filterDefault = (query) => {
  let queryStrings
  if (query.status_patient) {
    const splits = query.status_patient.split('-');
    if(splits[0] && splits[1]) {
      queryStrings = { "status": splits[0], "final_result": splits[1] }
    }else{
      queryStrings = { "status": splits[0] }
    }
  } else {
    queryStrings = { }
  }
  return queryStrings;
}

module.exports = {
  filterDefault, search
}