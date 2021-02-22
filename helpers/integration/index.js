const Case = require('../../models/Case')

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


const splitPayload1 = (data, patient) =>{
  return {
    last_date_status_patient: "2021-02-19",
    there_are_symptoms: true,
    first_symptom_date: "2021-02-19",
    diagnosis: ["Demam", "Sakit Tenggorokan"],
    diagnosis_ards: 2,
    diagnosis_covid: 2,
    diagnosis_pneumonia: 2,
    diagnosis_other: "gejala lain-lain",
    physical_check_temperature: 35,
    physical_check_blood_pressure: 98,
    physical_check_pulse: 88,
    physical_check_respiration: 80,
    physical_check_height: 167,
    physical_check_weight: 75,
    status: "CLOSECONTACT",
    other_diagnosis: "",
    other_diagnosisr_respiratory_disease: "",
    last_changed: "2021-02-18T03:03:40.398Z",
    diseases: ["Hipertensi"],
    diseases_other: "penyerta-lain2",
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
  const transform = {
    ...splitPayload1(data, patient),
    ...splitPayload2(patient),
    ...splitPayload3(patient)
  }

  console.log(transform);
}

module.exports = {
  findUserCases, transformDataPayload
}

