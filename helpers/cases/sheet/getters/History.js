const unknownDiagnosis = []
const registeredDiagnosis = []
const conf = require('../config.json')

const { refDiagnosis } = require('../reference')
const { _toString, _toDateString, getStringCode } = require('../helper')

const getStatus = (d) => {
  if (!d[conf.cell.status]) return undefined
  let status = _toString(d[conf.cell.status])
  if (status && status.toUpperCase) {
      status = status.toUpperCase()
  }
  return status || undefined
}

const getStage = (d) => {
  if (!d[conf.cell.stage]) return undefined
  let stage = _toString(d[conf.cell.stage])
  if (stage === 'Proses') return '0'
  else if (stage === 'Selesai') return '1'
  else return ''
}

const getFinalResult = (d) => {
  if(!d[conf.cell.final_result]) return null

  let criteriaCode = null
  const criteria = _toString(d[conf.cell.final_result])

  switch(criteria) {
    case 'Selesai Isolasi/Sembuh':
      criteriaCode = '1'
      break;
    case 'Meninggal':
      criteriaCode = '2'
      break;
    case 'Discarded':
      criteriaCode = '3'
      break;
    case 'Masih Sakit':
      criteriaCode = '4'
      break;
    case 'Masih Dikarantina':
      criteriaCode = '5'
      break;
    default:
      criteriaCode = '0'
  }

  return criteriaCode
}

const getReportSource = (d) => {
  return _toString(d[conf.cell.report_source])
}

const getDiagnosis = (d) => {
  const diagnosis = d[conf.cell.diagnosis]
    ? d[conf.cell.diagnosis].split(',')
    : []

  for (let i in diagnosis) {
      let diagnose = _toString(diagnosis[i])
      if (diagnose.trim) {
          diagnose = diagnose.trim()
      }
      if (refDiagnosis.includes(diagnose)) {
          registeredDiagnosis.push(diagnose)
      } else {
          unknownDiagnosis.push(diagnose)
      }
  }

  return registeredDiagnosis
}

const getDiagnosisOther = (d) => {
  let otherDiagnosis = _toString(d[conf.cell.diagnosis_other])
  if (!unknownDiagnosis.join) return null

  if (otherDiagnosis) {
    otherDiagnosis += ' ' + unknownDiagnosis.join(',')
  } else {
      otherDiagnosis = unknownDiagnosis.join(',')
  }

  return otherDiagnosis
}

const getFirstSymptomDate = (d) => {
  return _toDateString(d[conf.cell.first_symptom_date])
}

const getHistoryTracing = (d) => {
  return []
}

const isWentAbroad = (d) => {
  return d[conf.cell.is_went_abroad] == 'Dari luar negeri'
}

const getVisitedCountry = (d) => {
  return this.isWentAbroad ? _toString(d[conf.cell.visited_country]) : null
}

const getReturnDate = (d) => {
  if (!d[conf.cell.return_date]) return null
  return _toDateString(d[conf.cell.return_date])
}

const isWentOtherCity = (d) => {
  return d[conf.cell.is_went_other_city] == 'Dari luar kota'
}

const getVisitedCity = (d) => {
  return this.isWentOtherCity ? _toString(d[conf.cell.visited_city]) : null
}

const isContactWithPositive = (d) => {
  return d[conf.cell.is_contact_with_positive] == 'Kontak erat'
}

const getHistoryNotes = (d) => {
  return null
}

const getCurrentLocationType = (d) => {
  if (!d[conf.cell.current_location_type]) return undefined
  return d[conf.cell.current_location_type] == 'Ya' ? 'RS' : 'RUMAH'
}

const getCurrentHospitalId = (d) => {
  return getStringCode(d[conf.cell.current_hospital_id])
}

const getCurrentLocationAddress = (d) => {
  const locationType = d[conf.cell.current_location_type]
  const hospitalId = d[conf.cell.current_hospital_id]
  const address = d[conf.cell.current_location_address]
  if (locationType == 'Ya') {
      if (!hospitalId) return null
      return hospitalId.split('-')[0] || null
  }
  return address
}

const getCurrentLocationDistrictCode = (d) => {
  return getStringCode(d[conf.cell.current_location_district_code])
}

const getCurrentLocationSubdistrictCode = (d) => {
  return getStringCode(d[conf.cell.current_location_subdistrict_code])
}

const getCurrentLocationVillageCode = (d) => {
  return getStringCode(d[conf.cell.current_location_village_code])
}

const getOtherNotes = (d) => {
  return _toString(d[conf.cell.other_notes])
}

const getLastChanged = (d) => {
  return new Date()
}

const isSampleTaken = (d) => {
  return d[conf.cell.is_sample_taken] === 'Ya'
}

const isRowFilled = (d) => {
  const c = conf.cell
  if (d[c.name] || d[c.nik] || d[c.birth_date] || d[c.gender] || d[c.address_province_code]) return true
  else return false
}

module.exports = {
  // init,
  getStatus,
  getStage,
  getFinalResult,
  getReportSource,
  getDiagnosis,
  getDiagnosisOther,
  getFirstSymptomDate,
  getHistoryTracing,
  isWentAbroad,
  getVisitedCountry,
  getReturnDate,
  isWentOtherCity,
  getVisitedCity,
  isContactWithPositive,
  getHistoryNotes,
  getCurrentLocationType,
  getCurrentHospitalId,
  getCurrentLocationAddress,
  getCurrentLocationDistrictCode,
  getCurrentLocationSubdistrictCode,
  getCurrentLocationVillageCode,
  getOtherNotes,
  getLastChanged,
  isSampleTaken,
  isRowFilled,
}
