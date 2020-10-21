const sheet = {
  ...require('./Case'),
  ...require('./History'),
}

const caseIdentity = (d) => {
  return {
    interviewers_name: sheet.getInterviewerName(d),
    interviewers_phone_number: sheet.getInterviewerPhoneNumber(d),
    interview_date: sheet.getInterviewDate(d),
    nik: sheet.getNik(d),
    phone_number: sheet.getPhoneNumber(d),
    note_phone_number: sheet.getPhoneNumberNote(d),
    name: sheet.getName(d),
    name_parents: sheet.getNameParent(d),
    place_of_birth: sheet.getPlaceOfBirth(d),
    birth_date: sheet.getBirthDate(d),
    age: sheet.getAge(d),
    month: sheet.getAgeMonth(d),
    gender: sheet.getGender(d),
  }
}

const caseAddress = (d) => {
  return {
    address_province_code: sheet.getAddressProvinceCode(d),
    address_province_name: sheet.getAddressProvinceName(d),
    address_district_code: sheet.getAddressDistrictCode(d),
    address_district_name: sheet.getAddressDistrictName(d),
    address_subdistrict_code: sheet.getAddressSubdistrictCode(d),
    address_subdistrict_name: sheet.getAddressSubdistrictName(d),
    address_village_code: sheet.getAddressVillageCode(d),
    address_village_name: sheet.getAddressVillageName(d),
    rt: sheet.getAddressRT(d),
    rw: sheet.getAddressRW(d),
    address_street: sheet.getAddressStreet(d),
  }
}

const caseAdditionalInfo = (d) => {
  return {
    occupation: sheet.getOccupation(d),
    office_address: sheet.getOfficeAddress(d),
    nationality: sheet.getNationality(d),
    nationality_name: sheet.getNationalityName(d),
    income: sheet.getIncome(d),
    inspection_support: sheet.getInspectionSupport(d),
  }
}

// history attributes
const historyLocation = (d) => {
  return {
    current_location_type: sheet.getCurrentLocationType(d),
    current_hospital_id: sheet.getCurrentHospitalId(d),
    is_patient_address_same: sheet.getIsPatientAddressSame(d),
    current_location_district_code: sheet.getCurrentLocationDistrictCode(d),
    current_location_subdistrict_code: sheet.getCurrentLocationSubdistrictCode(d),
    current_location_village_code: sheet.getCurrentLocationVillageCode(d),
    current_location_address: sheet.getCurrentLocationAddress(d),
  }
}

const historyCondition = (d) => {
  return {
    there_are_symptoms: sheet.getIsHavingSymptoms(d),
    first_symptom_date: sheet.getFirstSymptomDate(d),
    diagnosis: sheet.getSymptoms(d),
    diagnosis_other: sheet.getSymptomsOther(d),
    diseases: sheet.getDiseases(d),
    diseases_other: sheet.getDiseasesOther(d),
    diagnosis_ards: sheet.getDiagnosisArds(d),
    diagnosis_pneumonia: sheet.getDiagnosisPneumonia(d),
    other_diagnosis: sheet.getOtherDiagnosis(d),
    is_other_diagnosisr_respiratory_disease: sheet.isOtherDiagnosisRespiratoryDisease(d),
    other_diagnosisr_respiratory_disease: sheet.getOtherDiagnosisRespiratoryDisease(d),
    physical_check_temperature: sheet.getPhysicalCheckTemperature(d),
    physical_check_blood_pressure: sheet.getPhysicalCheckBloodPressure(d),
    physical_check_pulse: sheet.getPhysicalCheckPulse(d),
    physical_check_respiration: sheet.getPhysicalCheckRespiration(d),
    physical_check_height: sheet.getPhysicalCheckHeight(d),
    physical_check_weight: sheet.getPhysicalCheckWeight(d),
    pysichal_activity: sheet.getPhysicalActivity(d),
    smoking: sheet.isSmoking(d),
    consume_alcohol: sheet.isConsumeAlcohol(d),
    status: sheet.getStatus(d),
    final_result: sheet.getFinalResult(d),
    last_date_status_patient: sheet.getLastDateStatusPatient(d),
  }
}


const getBuiltCreateCasePayload = (d, uniqueBatchId) => {
  return {
    ...caseIdentity(d),
    ...caseAddress(d),
    ...caseAdditionalInfo(d),
    ...historyLocation(d),
    ...historyCondition(d),
    input_source: `import-feature-${uniqueBatchId}`,
  }
}

module.exports = {
  ...sheet,
  getBuiltCreateCasePayload,
}
