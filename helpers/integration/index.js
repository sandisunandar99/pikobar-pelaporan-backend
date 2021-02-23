const Case = require('../../models/Case')
const {PUBSUB} = require('../constant')

const findUserCases = async(data) => {
  const user = data.user
  const cases = await Case.aggregate([
    { $match :{ $or :[{nik: user.nik},{phone_number: user.phone_number}]}},
    { $lookup :{from: "histories", localField: 'last_history', foreignField: '_id', as: 'histories' }},
    { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$histories", 0 ] }, "$$ROOT" ] } }},
    { $project : {histories: 0}},
    { $limit: (1)}
  ])
  return (cases.length > 0 ? cases : null)
}

const statusPikobar = (status)=> {
  let nameStatus = ""
  switch (status) {
    case "OTG":
      nameStatus = PUBSUB.OTG
      break;
    case "CONFIRMED":
      nameStatus = PUBSUB.CONFIRMED
      break;
    case "PDP":
      nameStatus = PUBSUB.SUSPECT
      break;
    case "ODP":
      nameStatus = PUBSUB.ODP
      break;
    default:
      nameStatus = undefined
      break;
  }
  return nameStatus
}

const splitPayload1 = (data, patient) =>{
  const date = new Date()
  data.last_date_status_patient = date.toISOString()
  return {
    last_date_status_patient: data.last_date_status_patient,
    there_are_symptoms: patient.there_are_symptoms,
    first_symptom_date: patient.first_symptom_date,
    diagnosis: data.symptoms,
    diagnosis_ards: patient.diagnosis_ards,
    diagnosis_covid: patient.diagnosis_covid,
    diagnosis_pneumonia: patient.diagnosis_pneumonia,
    diagnosis_other: patient.diagnosis_other,
    physical_check_temperature: patient.physical_check_temperature,
    physical_check_blood_pressure: patient.physical_check_blood_pressure,
    physical_check_pulse: patient.physical_check_pulse,
    physical_check_respiration: patient.physical_check_respiration,
    physical_check_height: patient.physical_check_height,
    physical_check_weight: patient.physical_check_weight,
    status: statusPikobar(data.user.health_status),
    other_diagnosis: patient.other_diagnosis,
    other_diagnosisr_respiratory_disease: patient.other_diagnosisr_respiratory_disease,
    last_changed: patient.last_changed,
    diseases: patient.diseases,
    diseases_other: patient.diseases_other,
  }
}

const splitPayload2 = (patient) =>{
  return {
    case: "602dd69fd38a440036a50794",
    history_tracing: [],
    is_went_abroad: false,
    visited_country: "",
    return_date: null,
    is_went_other_city: false,
    visited_city: "",
    is_patient_address_same: true,
    is_contact_with_positive: false,
    history_notes: "",
    report_source: "",
    stage: "",
    final_result: "5",
    is_other_diagnosisr_respiratory_disease: false,
    pysichal_activity: 0,
    smoking: 2,
    consume_alcohol: 2,
  }
}

const splitPayload3 = (patient) => {
  return {
    current_location_type: "RUMAH",
    current_hospital_id: null,
    current_location_address: "jl. simatupang",
    current_location_district_code: "32.73",
    current_location_subdistrict_code: "32.73.20",
    current_location_village_code: "32.73.20.1001",
    other_notes: "",
    current_hospital_type: null,
    current_location_province_code: "32",
    address_district_code: "32.73",
    address_subdistrict_code: "32.73.20",
    address_village_code: "32.73.20.1001",
    address_village_name: "Antapani Kulon",
    address_street: "asd"
  }
}

const transformDataPayload = (data, patient) => {
  console.log(splitPayload1(data, patient));
  const transform = {
    ...splitPayload1(data, patient),
    ...splitPayload2(patient),
    ...splitPayload3(patient)
  }

  return transform
}

module.exports = {
  findUserCases, transformDataPayload
}

