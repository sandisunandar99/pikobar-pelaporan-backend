let unknownSymptoms = [], registeredSymptoms = [];
let unknownDiseases = [], registeredDiseases = [];
const getters = {}
const conf = require('../config.json')

const {
  refSymptoms, refDiseases, refFinalResults, refCriterias, refActivities,
  findHospital
} = require('../reference')
const {
  _toString, _toDateString, _toUnsignedInt, getStringValueByIndex,
  getArrayValues, getUnknownValuesOfArray, yesNoUnknown, trueOrFalse, findReference,
} = require('../helper')

getters.getCurrentLocationType = (d) => {
  if (!d[conf.cell.current_location_type]) return undefined
  return d[conf.cell.current_location_type] == 'Ya dirawat' ? 'RS' : 'RUMAH'
}

getters.getCurrentHospitalId = async (d) => {
  const hospitalName = getStringValueByIndex(d[conf.cell.current_hospital_id], 0)
  let hospitalId = null

  if (hospitalName) {
    hospitalId = await findHospital(hospitalName)
  }

  return hospitalId
}

getters.getIsPatientAddressSame = (d) => {
  const state = _toString(d[conf.cell.is_patient_address_same])
  return state === 'Sesuai Alamat Tinggal'
}

getters.getCurrentLocationDistrictCode = (d) => {
  return getStringValueByIndex(d[conf.cell.current_location_district_code], 1)
}

getters.getCurrentLocationSubdistrictCode = (d) => {
  return getStringValueByIndex(d[conf.cell.current_location_subdistrict_code], 1)
}

getters.getCurrentLocationVillageCode = (d) => {
  return getStringValueByIndex(d[conf.cell.current_location_village_code], 1)
}

getters.getCurrentLocationAddress = (d) => {
  const locationType = d[conf.cell.current_location_type]
  const hospitalId = d[conf.cell.current_hospital_id]
  const address = d[conf.cell.current_location_address]

  if (locationType == 'Ya dirawat') {
      if (!hospitalId) return null
      return hospitalId.split('-')[0] || null
  }
  return address
}

getters.getIsHavingSymptoms = (d) => {
  const symptoms = getters.getSymptoms(d)
  const symptomsOther = getters.getSymptomsOther(d)

  if (symptoms.length || symptomsOther) return true;

  return false
}

getters.getFirstSymptomDate = (d) => {
  return _toDateString(d[conf.cell.first_symptom_date])
}

getters.getSymptoms = (d) => {
  const symptoms = getArrayValues(refSymptoms, d[conf.cell.diagnosis])
  registeredSymptoms = symptoms.registered
  unknownSymptoms = symptoms.unknown
  return registeredSymptoms
}

getters.getSymptomsOther = (d) => {
  return getUnknownValuesOfArray(d[conf.cell.diagnosis_other], unknownSymptoms)
}

getters.getDiseases = (d) => {
  const diseases = getArrayValues(refDiseases, d[conf.cell.diseases])
  const { registered, unknown } = diseases

  // put value
  registeredDiseases = registered
  unknownDiseases = unknown
  return registered
}

getters.getDiseasesOther = (d) => {
  return getUnknownValuesOfArray(d[conf.cell.diseases_other], unknownDiseases)
}

getters.getDiagnosisArds = (d) => {
  return yesNoUnknown(d[conf.cell.diagnosis_ards])
}

getters.getDiagnosisPneumonia = (d) => {
  return yesNoUnknown(d[conf.cell.diagnosis_pneumonia])
}

getters.getOtherDiagnosis = (d) => {
  return _toString(d[conf.cell.other_diagnosis])
}

getters.isOtherDiagnosisRespiratoryDisease = (d) => {
  return trueOrFalse(d[conf.cell.is_other_diagnosisr_respiratory_disease])
}

getters.getOtherDiagnosisRespiratoryDisease = (d) => {
  return _toString(d[conf.cell.other_diagnosisr_respiratory_disease])
}

getters.getPhysicalCheckTemperature = (d) => {
  return _toUnsignedInt(d[conf.cell.physical_check_temperature])
}

getters.getPhysicalCheckBloodPressure = (d) => {
  return _toUnsignedInt(d[conf.cell.physical_check_blood_pressure])
}

getters.getPhysicalCheckPulse = (d) => {
  return _toUnsignedInt(d[conf.cell.physical_check_pulse])
}

getters.getPhysicalCheckRespiration = (d) => {
  return _toUnsignedInt(d[conf.cell.physical_check_respiration])
}

getters.getPhysicalCheckHeight = (d) => {
  return _toUnsignedInt(d[conf.cell.physical_check_height])
}

getters.getPhysicalCheckWeight = (d) => {
  return _toUnsignedInt(d[conf.cell.physical_check_weight])
}

getters.getPhysicalActivity = (d) => {
  return findReference(refActivities, d[conf.cell.pysichal_activity])
}

getters.isSmoking = (d) => {
  return yesNoUnknown(d[conf.cell.smoking])
}

getters.isConsumeAlcohol = (d) => {
  return yesNoUnknown(d[conf.cell.consume_alcohol])
}

getters.getStatus = (d) => {
  if (!d[conf.cell.status]) return undefined
  const criteria =  findReference(refCriterias, d[conf.cell.status])
  return criteria ? _toString(criteria) : null
}

getters.getFinalResult = (d) => {
  if (!d[conf.cell.status]) return undefined
  const result = findReference(refFinalResults, d[conf.cell.final_result])
  return result ? _toString(result) : null
}

getters.getLastDateStatusPatient = (d) => {
  if (!d[conf.cell.last_date_status_patient]) return null
  return _toDateString(d[conf.cell.last_date_status_patient])
}

getters.isRowFilled = (d) => {
  const c = conf.cell
  if (d[c.name] || d[c.nik] || d[c.birth_date] || d[c.gender] || d[c.address_province_code]) return true
  else return false
}

module.exports = getters
