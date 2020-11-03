const conf = require('../../config.json')
const { refTravelingType } = require('../../reference')
const { _toString, _toDateString, findReference } = require('../../helper')

// traveling_history attributes
const getTravelingType = (d) => {
  return findReference(refTravelingType, d[conf.cell.traveling_type])
}

const getTravelingVisited = (d) => {
  return _toString(d[conf.cell.travelling_visited])
}

const getTravelingCity = (d) => {
  return _toString(d[conf.cell.travelling_city])
}

const getTravelingDate = (d) => {
  return _toDateString(d[conf.cell.travelling_date])
}

const getTravelingArrive = (d) => {
  return _toDateString(d[conf.cell.travelling_arrive])
}

module.exports = {
  getTravelingType,
  getTravelingVisited,
  getTravelingCity,
  getTravelingDate,
  getTravelingArrive,
}
