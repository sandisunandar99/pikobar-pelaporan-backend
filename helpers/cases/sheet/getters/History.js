const unknownDiagnosis = []
const registeredDiagnosis = []
const conf = require('../config.json')

const { refDiagnosis } = require('../reference')
const { _toString, _toDateString } = require('../helper')

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

  let resultCode = null
  const status = this.getStatus
  const result = _toString(d[conf.cell.final_result])

  if (status === 'OTG' || status === 'ODP') return null

  if (result == 'Sembuh') resultCode = '1'
  else if (result == 'Meninggal') resultCode = '2'
  if (result == 'Negatif' && status !== 'POSITIF') resultCode = '0'

  return resultCode
}

const getReportSource = (d) => {
  return _toString(d[conf.cell.report_source])
}

const getDiagnosis = (d) => {
  if (!d[conf.cell.diagnosis]) return []
  let diagnosis = d[conf.cell.diagnosis].split(',')

  for (i in diagnosis) {
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

  return registeredDiagnosis || []
}

const getDiagnosisOther = (d) => {
  let otherDiagnosis = _toString(d[conf.cell.diagnosis_other])
  if (unknownDiagnosis && unknownDiagnosis.join) {
      if (otherDiagnosis) {
          otherDiagnosis += ' ' + unknownDiagnosis.join(',')
      } else {
          otherDiagnosis = unknownDiagnosis.join(',')
      }
  }
  return otherDiagnosis || null
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
  if (!d[conf.cell.current_hospital_id]) return null
  return d[conf.cell.current_hospital_id].split('-')[1] || null
}

const getCurrentLocationAddress = (d) => {
  if (d[conf.cell.current_location_type] == 'Ya') {
      if (!d[conf.cell.current_hospital_id]) return null
      return d[conf.cell.current_hospital_id].split('-')[0] || null
  } else {
      return d[conf.cell.current_location_address]
  }
}

const getCurrentLocationDistrictCode = (d) => {
  if (!d[conf.cell.current_location_district_code]) return null
  return _toString(d[conf.cell.current_location_district_code].split('-')[1] || null)
}

const getCurrentLocationSubdistrictCode = (d) => {
  if (!d[conf.cell.current_location_subdistrict_code]) return null
  return _toString(d[conf.cell.current_location_subdistrict_code].split('-')[1] || null)
}

const getCurrentLocationVillageCode = (d) => {
  if (!d[conf.cell.current_location_village_code]) return null
  return _toString(d[conf.cell.current_location_village_code].split('-')[1] || null)
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
