let unknownSymptoms = [], registeredSymptoms = [];
let unknownDiseases = [], registeredDiseases = [];
const conf = require('../config.json')
const { CRITERIA } = require('../../../constant')

const { refSymptoms, refDiseases, findHospital } = require('../reference')
const {
  _toString, _toDateString, _toUnsignedInt, getStringValueByIndex,
  getArrayValues, getUnknownValuesOfArray, yesNoUnknown, trueOrFalse
} = require('../helper')

const getCurrentLocationType = (d) => {
  if (!d[conf.cell.current_location_type]) return undefined
  return d[conf.cell.current_location_type] == 'Ya dirawat' ? 'RS' : 'RUMAH'
}

const getCurrentHospitalId = async (d) => {
  const hospitalName = getStringValueByIndex(d[conf.cell.current_hospital_id], 0)
  let hospitalId = null

  if (hospitalName) {
    hospitalId = await findHospital(hospitalName)
  }

  return hospitalId
}

const getIsPatientAddressSame = (d) => {
  const state = _toString(d[conf.cell.is_patient_address_same])
  return state === 'Sesuai Alamat Tinggal'
}

const getCurrentLocationDistrictCode = (d) => {
  return getStringValueByIndex(d[conf.cell.current_location_district_code], 1)
}

const getCurrentLocationSubdistrictCode = (d) => {
  return getStringValueByIndex(d[conf.cell.current_location_subdistrict_code], 1)
}

const getCurrentLocationVillageCode = (d) => {
  return getStringValueByIndex(d[conf.cell.current_location_village_code], 1)
}

const getCurrentLocationAddress = (d) => {
  const locationType = d[conf.cell.current_location_type]
  const hospitalId = d[conf.cell.current_hospital_id]
  const address = d[conf.cell.current_location_address]
  if (locationType == 'Ya dirawat') {
      if (!hospitalId) return null
      return hospitalId.split('-')[0] || null
  }
  return address
}

const getIsHavingSymptoms = (d) => {
  const symptoms = getSymptoms(d)
  const symptomsOther = getSymptomsOther(d)

  if (symptoms.length || symptomsOther) return true;

  return false
}

const getFirstSymptomDate = (d) => {
  return _toDateString(d[conf.cell.first_symptom_date])
}

const getSymptoms = (d) => {
  const symptoms = getArrayValues(refSymptoms, d[conf.cell.diagnosis])
  registeredSymptoms = symptoms.registered
  unknownSymptoms = symptoms.unknown
  return registeredSymptoms
}

const getSymptomsOther = (d) => {
  return getUnknownValuesOfArray(d[conf.cell.diagnosis_other], unknownSymptoms)
}

const getDiseases = (d) => {
  const diseases = getArrayValues(refDiseases, d[conf.cell.diseases])
  const { registered, unknown } = diseases

  // put value
  registeredDiseases = registered
  unknownDiseases = unknown
  return registered
}

const getDiseasesOther = (d) => {
  return getUnknownValuesOfArray(d[conf.cell.diseases_other], unknownDiseases)
}

const getDiagnosisArds = (d) => {
  return yesNoUnknown(d[conf.cell.diagnosis_ards])
}

const getDiagnosisPneumonia = (d) => {
  return yesNoUnknown(d[conf.cell.diagnosis_pneumonia])
}

const getOtherDiagnosis = (d) => {
  return _toString(d[conf.cell.other_diagnosis])
}

const isOtherDiagnosisRespiratoryDisease = (d) => {
  return trueOrFalse(d[conf.cell.is_other_diagnosisr_respiratory_disease])
}

const getOtherDiagnosisRespiratoryDisease = (d) => {
  return _toString(d[conf.cell.other_diagnosisr_respiratory_disease])
}

const getPhysicalCheckTemperature = (d) => {
  return _toUnsignedInt(d[conf.cell.physical_check_temperature])
}

const getPhysicalCheckBloodPressure = (d) => {
  return _toUnsignedInt(d[conf.cell.physical_check_blood_pressure])
}

const getPhysicalCheckPulse = (d) => {
  return _toUnsignedInt(d[conf.cell.physical_check_pulse])
}

const getPhysicalCheckRespiration = (d) => {
  return _toUnsignedInt(d[conf.cell.physical_check_respiration])
}

const getPhysicalCheckHeight = (d) => {
  return _toUnsignedInt(d[conf.cell.physical_check_height])
}

const getPhysicalCheckWeight = (d) => {
  return _toUnsignedInt(d[conf.cell.physical_check_weight])
}

const getPhysicalActivity = (d) => {
  let res = null
  let activity = _toString(d[conf.cell.pysichal_activity])

  if (activity) {
    activity.trim().toLowerCase()
  }

  switch (activity) {
    case 'sedenter': res = 0;
      break;
    case '<150 menit per-minggu': res = 1;
      break;
    case '>150 menit per-minggu': res = 2;
      break;
    default: res = null;
  }

  return res
}

const isSmoking = (d) => {
  return yesNoUnknown(d[conf.cell.smoking])
}

const isConsumeAlcohol = (d) => {
  return yesNoUnknown(d[conf.cell.consume_alcohol])
}

const getStatus = (d) => {
  if (!d[conf.cell.status]) return undefined
  let status = _toString(d[conf.cell.status])
  if (status && status.toUpperCase) {
      status = status.trim().toUpperCase()
  }

  let res
  switch (status) {
    case 'KONTAK ERAT':
      res = CRITERIA.CLOSE;
      break;
    case 'SUSPEK':
      res = CRITERIA.SUS;
      break;
    case 'KONFIRMASI':
      res = CRITERIA.CONF;
      break;
    case 'PROBABEL':
      res = CRITERIA.PROB;
      break;
    default: res = null;
  }

  return res
}

const getFinalResult = (d) => {
  if(!d[conf.cell.final_result]) return null

  let resultCode = null
  let result = _toString(d[conf.cell.final_result])

  if (result) { result = result.trim().toLowerCase() }

  switch(result) {
    case 'selesai isolasi/sembuh':
      resultCode = '1'
      break;
    case 'meninggal':
      resultCode = '2'
      break;
    case 'discarded':
      resultCode = '3'
      break;
    case 'Masih Sakit':
      resultCode = '4'
      break;
    case 'masih dikarantina':
      resultCode = '5'
      break;
    default:
      resultCode = '0'
  }

  return resultCode
}

const getLastDateStatusPatient = (d) => {
  if (!d[conf.cell.last_date_status_patient]) return null
  return _toDateString(d[conf.cell.last_date_status_patient])
}

const isRowFilled = (d) => {
  const c = conf.cell
  if (d[c.name] || d[c.nik] || d[c.birth_date] || d[c.gender] || d[c.address_province_code]) return true
  else return false
}

module.exports = {
  getCurrentLocationType,
  getCurrentHospitalId,
  getIsPatientAddressSame,
  getCurrentLocationDistrictCode,
  getCurrentLocationSubdistrictCode,
  getCurrentLocationVillageCode,
  getCurrentLocationAddress,
  getIsHavingSymptoms,
  getFirstSymptomDate,
  getSymptoms,
  getSymptomsOther,
  getDiseases,
  getDiseasesOther,
  getDiagnosisArds,
  getDiagnosisPneumonia,
  getOtherDiagnosis,
  isOtherDiagnosisRespiratoryDisease,
  getOtherDiagnosisRespiratoryDisease,
  getPhysicalCheckTemperature,
  getPhysicalCheckBloodPressure,
  getPhysicalCheckPulse,
  getPhysicalCheckRespiration,
  getPhysicalCheckHeight,
  getPhysicalCheckWeight,
  getPhysicalActivity,
  isSmoking,
  isConsumeAlcohol,
  getStatus,
  getFinalResult,
  getLastDateStatusPatient,
  isRowFilled,
}
