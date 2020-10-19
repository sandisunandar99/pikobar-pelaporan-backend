const extractSheetToJson = async (request) => {
    const dir = './upload/'
    const conf = require('./config.json')
    const caseSheet = require('./getters/index')
    const xlsx = require('node-xlsx')

    //  genretae unique import batch id (debug purpose)
    const uniqueBatchId = require('uuid').v4()

    const uploaded = await handleFileUpload(request.payload.file)

    let dataSheet = (await xlsx.parse(dir + uploaded.filename))[0]['data']

    const version = `VERSION ${conf.version}`
    const verfiedTemplate = conf.verified_template
    if (dataSheet[1][34] !== verfiedTemplate
      || dataSheet[2][34] !== verfiedTemplate
      || dataSheet[3][34] !== verfiedTemplate
      || dataSheet[4][34] !== verfiedTemplate ) {
      return conf.unverified_template
    }

    if (dataSheet[0][34] !== version) {
      return conf.version_out_of_date
    }

    dataSheet.splice(0, conf.start_row)
    let payload = []

    for (i in dataSheet)
    {
      const d = dataSheet[i]

      if (!caseSheet.isRowFilled(d)) continue

      let obj = {
        id_case_national: caseSheet.getIdCaseNational(d),
        id_case_related: caseSheet.getIdCaseRelated(d),
        name_case_related: caseSheet.getNameCaseRelated(d),
        name: caseSheet.getName(d),
        nik: caseSheet.getNik(d), //todo
        birth_date: caseSheet.getBirthDate(d),
        age: caseSheet.getAge(d),
        gender: caseSheet.getGender(d),
        phone_number: caseSheet.getPhoneNumber(d),
        address_street: caseSheet.getAddressStreet(d),
        address_province_code: caseSheet.getAddressProvinceCode(d),
        address_province_name: caseSheet.getAddressProvinceName(d),
        address_district_code: caseSheet.getAddressDistrictCode(d),
        address_district_name: caseSheet.getAddressDistrictName(d),
        address_subdistrict_code: caseSheet.getAddressSubdistrictCode(d),
        address_subdistrict_name: caseSheet.getAddressSubdistrictName(d),
        address_village_code: caseSheet.getAddressVillageCode(d),
        address_village_name: caseSheet.getAddressVillageName(d),
        nationality: caseSheet.getNationality(d),
        nationality_name: caseSheet.getNationalityName(d),
        occupation: caseSheet.getOccupation(d),
        office_address: caseSheet.getOfficeAddress(d),
        status: caseSheet.getStatus(d),
        stage: caseSheet.getStage(d),
        final_result: caseSheet.getFinalResult(d),
        report_source: caseSheet.getReportSource(d), //todo
        diagnosis: caseSheet.getDiagnosis(d),
        diagnosis_other: caseSheet.getDiagnosisOther(d), //todo
        first_symptom_date: caseSheet.getFirstSymptomDate(d), //todo
        history_tracing: caseSheet.getHistoryTracing(d),
        is_went_abroad: caseSheet.isWentAbroad(d), //todo
        visited_country: caseSheet.getVisitedCountry(d), //todo
        return_date: caseSheet.getReturnDate(d), //todo
        is_went_other_city: caseSheet.isWentOtherCity(d), //todo
        visited_city: caseSheet.getVisitedCity(d), //todo
        is_contact_with_positive: caseSheet.isContactWithPositive(d), //todo
        history_notes: caseSheet.getHistoryNotes(d), //todo
        current_location_type: caseSheet.getCurrentLocationType(d),
        current_hospital_id: caseSheet.getCurrentHospitalId(d),
        current_location_address: caseSheet.getCurrentLocationAddress(d),
        current_location_district_code: caseSheet.getCurrentLocationDistrictCode(d),
        current_location_subdistrict_code: caseSheet.getCurrentLocationSubdistrictCode(d),
        current_location_village_code: caseSheet.getCurrentLocationVillageCode(d),
        other_notes: caseSheet.getOtherNotes(d), //todo
        last_changed: caseSheet.getLastChanged(d),
        is_sample_taken:caseSheet.isSampleTaken(d),
        input_source: `import-feature-${uniqueBatchId}`,
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
  extractSheetToJson,
  isDistrictCodeValid,
}
