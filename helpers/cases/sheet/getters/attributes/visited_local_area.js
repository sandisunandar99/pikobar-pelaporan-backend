const conf = require('../../config.json')
const { _toString } = require('../../helper')

// visited_local_area attributes
const getVisitedLocalAreaProvince = (d) => {
  return _toString(d[conf.cell.visited_local_area_province])
}

const getVisitedLocalAreaCity = (d) => {
  return _toString(d[conf.cell.visited_local_area_city])
}

module.exports = {
  getVisitedLocalAreaProvince,
  getVisitedLocalAreaCity,
}
