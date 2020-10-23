const conf = require('../../config.json')
const { _toString, _toDateString, _toUnsignedInt } = require('../../helper')
// part of inspection support
const getInspectionType = (d) => {
  let result = null
  let selected = _toString(d[conf.cell.inspection_type])

  if (selected) { selected = selected.trim().toLowerCase() }

  switch(selected) {
    case 'pcr':
      result = 'pcr'
      break;
    case 'rapid':
      result = 'rapid'
      break;
    case 'radiologi':
      result = 'radiologi'
      break;
    case 'ct-scan':
      result = 'ct_scan'
      break;
    case 'tcm-sars cov-2':
      result = 'tcm_sars_cov_2'
      break;
    default:
      result = null
  }

  return result
}

const getSpecienType = (d) => {
  let result = null
  let selected = _toString(d[conf.cell.specimens_type])

  if (selected) { selected = selected.trim().toLowerCase() }

  switch(selected) {
    case 'swab nasofaring':
      result = 'Swab Nasofaring'
      break;
    case 'swab orofaring':
      result = 'Swab Orofaring'
      break;
    case 'swab naso-orofaring':
      result = 'Swab Naso - Orofaring'
      break;
    case 'darah':
      result = 'Darah'
      break;
    default:
      result = null
  }

  return result
}

const getInspectionDate = (d) => {
  return _toDateString(d[conf.cell.inspection_date])
}

const getInspectionLocation = (d) => {
  return _toString(d[conf.cell.inspection_location])
}

const getSpecimenTo = (d) => {
  return _toUnsignedInt(d[conf.cell.get_specimens_to])
}

const getInspectionResult = (d) => {
  return _toString(d[conf.cell.inspection_result])
}

module.exports = {
  getInspectionType,
  getSpecienType,
  getInspectionDate,
  getInspectionLocation,
  getSpecimenTo,
  getInspectionResult,
}
