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
    there_are_symptoms: patient.there_are_symptoms === undefined ? null : patient.there_are_symptoms,
    first_symptom_date: patient.first_symptom_date === undefined ? null : patient.first_symptom_date,
    diagnosis: data.symptoms,
    diagnosis_ards: patient.diagnosis_ards === undefined ? null : patient.diagnosis_ards,
    diagnosis_covid: patient.diagnosis_covid === undefined ? null : patient.diagnosis_covid,
    diagnosis_pneumonia: patient.diagnosis_pneumonia === undefined ? null : patient.diagnosis_pneumonia,
    diagnosis_other: patient.diagnosis_other === undefined ? null : patient.diagnosis_other,
    physical_check_temperature: patient.physical_check_temperature === undefined ? null : patient.physical_check_temperature,
    physical_check_blood_pressure: patient.physical_check_blood_pressure === undefined ? null : patient.physical_check_blood_pressure,
    physical_check_pulse: patient.physical_check_pulse === undefined ? null : patient.physical_check_pulse,
    physical_check_respiration: patient.physical_check_respiration === undefined ? null : patient.physical_check_respiration,
    physical_check_height: patient.physical_check_height === undefined ? null : patient.physical_check_height,
    physical_check_weight: patient.physical_check_weight === undefined ? null : patient.physical_check_weight,
    status: statusPikobar(data.user.health_status),
    other_diagnosis: patient.other_diagnosis === undefined ? null : patient.other_diagnosis,
    other_diagnosisr_respiratory_disease: patient.other_diagnosisr_respiratory_disease === undefined ? null : patient.other_diagnosisr_respiratory_disease,
    last_changed: patient.last_changed === undefined ? null : patient.last_changed,
    diseases: patient.diseases === undefined ? null : patient.diseases,
    diseases_other: patient.diseases_other === undefined ? null : patient.diseases_other,
  }
}

const splitPayload2 = (patient) =>{
  return {
    case : patient.case,
    history_tracing : patient.history_tracing === undefined ? null : patient.history_tracing,
    is_went_abroad : patient.is_went_abroad === undefined ? null : patient.is_went_abroad,
    visited_country : patient.visited_country === undefined ? null : patient.visited_country,
    return_date : patient.return_date === undefined ? null : patient.return_date,
    is_went_other_city : patient.is_went_other_city === undefined ? null : patient.is_went_other_city,
    visited_city : patient.visited_city === undefined ? null : patient.visited_city,
    is_patient_address_same : patient.is_patient_address_same === undefined ? null : patient.is_patient_address_same,
    is_contact_with_positive : patient.is_contact_with_positive === undefined ? null : patient.is_contact_with_positive,
    history_notes : patient.history_notes === undefined ? null : patient.history_notes,
    report_source : patient.report_source === undefined ? null : patient.report_source,
    stage : patient.stage === undefined ? null : patient.stage,
    final_result : patient.final_result === undefined ? null : patient.final_result,
    is_other_diagnosisr_respiratory_disease : patient.is_other_diagnosisr_respiratory_disease === undefined ? null : patient.is_other_diagnosisr_respiratory_disease,
    pysichal_activity : patient.pysichal_activity === undefined ? null : patient.pysichal_activity,
    smoking : patient.smoking === undefined ? null : patient.smoking,
    consume_alcohol : patient.consume_alcohol === undefined ? null : patient.consume_alcohol
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
  console.log(splitPayload2(patient));
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

