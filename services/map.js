const Case = require('../models/Case')
const check = require('../helpers/rolecheck')
const filter = require('../helpers/filter/casefilter')
const filterMap = require('../helpers/filter/mapfilter')

const listMap = async (query, user, callback) => {
  try {
    const search = check.countByRole(user)
    const filters = await filter.filterCase(user, query)
    const searching = Object.assign(search, filters)
    // const filterSearch = Object.assign(searching, filterMap.filterDefault(query))
    const res = await Case.find(searching).where("delete_status").ne("deleted").limit(200)
    const result = await Promise.all(res.map(async r => await r.MapOutput()))
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.map.listMap',
    method: listMap
  }
];

