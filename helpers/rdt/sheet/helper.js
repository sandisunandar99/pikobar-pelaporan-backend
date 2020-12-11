const sheet = {
  ...require('./sheet')
}

const createPayload = (data, uniqueBatchId) =>{
  return {
    ...createRdt(data),
    source_data: `import-rdt-${uniqueBatchId}`
  }
}

const createRdt = (data) =>{
  return {
    no: sheet.getNum(data),
    target: sheet.getTarget(data),
    category: sheet.getcategory(data),
    name: sheet.getName(data),
    nik: sheet.getNik(data),
    phone_number: sheet.getPhoneNumber(data),
    gender: sheet.getGender(data),
    age: sheet.getAge(data),
    birth_date: sheet.getBirthDate(data),
    address_district_code: sheet.getAddressDistrictCode(data),
    address_district_name: sheet.getAddressDistrictName(data),
    address_subdistrict_code: sheet.getAddressSubdistrictCode(data),
    address_subdistrict_name: sheet.getAddressSubdistrictName(data),
    address_village_code: sheet.getAddressVillageCode(data),
    address_village_name: sheet.getAddressVillageName(data),
    address_street: sheet.getAddressStreet(data),
    nationality: sheet.getNationality(data),
    nationality_name: sheet.getNationalityName(data),
    tool_tester: sheet.getToolTester(data),
    test_method: sheet.getTestMethod(data),
    test_location_type: sheet.getTestLocationType(data),
    test_location: sheet.getTestLocation(data),
    final_result: sheet.getFinalResult(data),
    swab_to: sheet.getSwabTo(data),
    test_date: sheet.getTestDate(data),
    test_note: sheet.getTestNote(data),
    note_nik: sheet.getNoteNik(data),
    note_phone_number: sheet.getNotePhoneNumber(data)
  }
}


module.exports ={
  createPayload
}