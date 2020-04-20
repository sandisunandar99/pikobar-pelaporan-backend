const caseSheetExtraction = async (request) => {
    const dir = './upload/'
    const conf = require('./casesheetconfig.json')
    const caseSheet = require('./casesheet')
    const readXlsxFile = require('read-excel-file/node')
    
    const uploaded = await handleFileUpload(request.payload.file)
  
    let dataSheet = await readXlsxFile(dir + uploaded.filename)

    dataSheet.splice(0, conf.start_row)
    let payload = []
    
    for (i in dataSheet)
    {
      if (dataSheet[i][0] === null) continue 

      caseSheet.init(dataSheet[i], conf)

      let obj = {
        id_case_national: caseSheet.getIdCaseNational(),
        id_case_related: caseSheet.getIdCaseRelated(),
        name_case_related: caseSheet.getNameCaseRelated(),
        name: caseSheet.getName(),
        nik: caseSheet.getNik(), //todo
        birth_date: caseSheet.getBirthDate(),
        age: caseSheet.getAge(),
        gender: caseSheet.getGender(),
        phone_number: caseSheet.getPhoneNumber(),
        address_street: caseSheet.getAddressStreet(),
        address_province_code: caseSheet.getAddressProvinceCode(),
        address_province_name: caseSheet.getAddressProvinceName(),
        address_district_code: caseSheet.getAddressDistrictCode(),
        address_district_name: caseSheet.getAddressDistrictName(),
        address_subdistrict_code: caseSheet.getAddressSubdistrictCode(),
        address_subdistrict_name: caseSheet.getAddressSubdistrictName(),
        address_village_code: caseSheet.getAddressVillageCode(),
        address_village_name: caseSheet.getAddressVillageName(),
        nationality: caseSheet.getNationality(),
        nationality_name: caseSheet.getNationalityName(),
        occupation: caseSheet.getOccupation(),
        office_address: caseSheet.getOfficeAddress(),            
        status: caseSheet.getStatus(),
        stage: caseSheet.getStage(),
        final_result: caseSheet.getFinalResult(),
        report_source: caseSheet.getReportSource(), //todo
        diagnosis: caseSheet.getDiagnosis(),
        diagnosis_other: caseSheet.getDiagnosisOther(), //todo
        first_symptom_date: caseSheet.getFirstSymptomDate(), //todo
        history_tracing: caseSheet.getHistoryTracing(),
        is_went_abroad: caseSheet.isWentAbroad(), //todo
        visited_country: caseSheet.getVisitedCountry(), //todo
        return_date: caseSheet.getReturnDate(), //todo
        is_went_other_city: caseSheet.isWentOtherCity(), //todo
        visited_city: caseSheet.getVisitedCity(), //todo
        is_contact_with_positive: caseSheet.isContactWithPositive(), //todo
        history_notes: caseSheet.getHistoryNotes(), //todo 
        current_location_type: caseSheet.getCurrentLocationType(),
        current_hospital_id: caseSheet.getCurrentHospitalId(),
        current_location_address: caseSheet.getCurrentLocationAddress(),
        current_location_district_code: caseSheet.getCurrentLocationDistrictCode(),
        current_location_subdistrict_code: caseSheet.getCurrentLocationSubdistrictCode(),
        current_location_village_code: caseSheet.getCurrentLocationVillageCode(),
        other_notes: caseSheet.getOtherNotes(), //todo
        last_changed: caseSheet.getLastChanged(),
        is_sample_taken:caseSheet.isSampleTaken() 
      }
      
      for (var key in obj) {
        if(obj[key] && obj[key].trim)
           obj[key] = obj[key].trim()
      }
      
      payload.push(obj)
    }

    handleFileUnlink(dir + uploaded.filename)
    return payload
}

const isDistrictCodeValid = async (code) => {

    const mongoose = require('mongoose')
    const DistrictCity = mongoose.model('Districtcity')
    const district = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code})

    return !!district
}

const handleFileUpload = file => {
  const fs = require('fs')
  const dir = './upload/'

  return new Promise((resolve, reject) => {
    var filename = new Date().getTime() + '_' + file.hapi.filename.replace(' ', '')
    const data = file._data

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    fs.writeFile(dir + filename, data, err => {
      if (err) {
        return callback(err, null)
      }
      resolve({ filename: filename })
    })
  })
}

const handleFileUnlink = file => {
  const fs = require('fs')
  return fs.unlink(file, (err) => {
      if (err) {
        console.error(err)
        return
      }
  })
}

module.exports = {
    caseSheetExtraction,
    isDistrictCodeValid,
}