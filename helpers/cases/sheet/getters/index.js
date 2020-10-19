const sheet = {
  ...require('./Case'),
  ...require('./History'),
}

const getBuiltCreateCasePayload = (d, uniqueBatchId) => {
  return {
    id_case_national: sheet.getIdCaseNational(d),
    id_case_related: sheet.getIdCaseRelated(d),
    name_case_related: sheet.getNameCaseRelated(d),
    name: sheet.getName(d),
    nik: sheet.getNik(d), //todo
    birth_date: sheet.getBirthDate(d),
    age: sheet.getAge(d),
    gender: sheet.getGender(d),
    phone_number: sheet.getPhoneNumber(d),
    address_street: sheet.getAddressStreet(d),
    address_province_code: sheet.getAddressProvinceCode(d),
    address_province_name: sheet.getAddressProvinceName(d),
    address_district_code: sheet.getAddressDistrictCode(d),
    address_district_name: sheet.getAddressDistrictName(d),
    address_subdistrict_code: sheet.getAddressSubdistrictCode(d),
    address_subdistrict_name: sheet.getAddressSubdistrictName(d),
    address_village_code: sheet.getAddressVillageCode(d),
    address_village_name: sheet.getAddressVillageName(d),
    nationality: sheet.getNationality(d),
    nationality_name: sheet.getNationalityName(d),
    occupation: sheet.getOccupation(d),
    office_address: sheet.getOfficeAddress(d),
    status: sheet.getStatus(d),
    stage: sheet.getStage(d),
    final_result: sheet.getFinalResult(d),
    report_source: sheet.getReportSource(d), //todo
    diagnosis: sheet.getDiagnosis(d),
    diagnosis_other: sheet.getDiagnosisOther(d), //todo
    first_symptom_date: sheet.getFirstSymptomDate(d), //todo
    history_tracing: sheet.getHistoryTracing(d),
    is_went_abroad: sheet.isWentAbroad(d), //todo
    visited_country: sheet.getVisitedCountry(d), //todo
    return_date: sheet.getReturnDate(d), //todo
    is_went_other_city: sheet.isWentOtherCity(d), //todo
    visited_city: sheet.getVisitedCity(d), //todo
    is_contact_with_positive: sheet.isContactWithPositive(d), //todo
    history_notes: sheet.getHistoryNotes(d), //todo
    current_location_type: sheet.getCurrentLocationType(d),
    current_hospital_id: sheet.getCurrentHospitalId(d),
    current_location_address: sheet.getCurrentLocationAddress(d),
    current_location_district_code: sheet.getCurrentLocationDistrictCode(d),
    current_location_subdistrict_code: sheet.getCurrentLocationSubdistrictCode(d),
    current_location_village_code: sheet.getCurrentLocationVillageCode(d),
    other_notes: sheet.getOtherNotes(d), //todo
    last_changed: sheet.getLastChanged(d),
    is_sample_taken:sheet.isSampleTaken(d),
    input_source: `import-feature-${uniqueBatchId}`,
  }
}

module.exports = {
  ...sheet,
  getBuiltCreateCasePayload,
}
