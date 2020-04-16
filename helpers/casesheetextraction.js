const caseSheetExtraction = async (request) => {
    const fs = require('fs')
    const readXlsxFile = require('read-excel-file/node')
    const dir = './upload/'
  
  
    const handleFileUpload = file => {
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
  
    const uploaded = await handleFileUpload(request.payload.file)
  
    let dataSheet = await readXlsxFile(dir + uploaded.filename)

    dataSheet.splice(0,6)
  
    let payload = []
    
    for (i in dataSheet)
    {
      if (dataSheet[i][0] === null) continue 
      
      let dt = dataSheet[i]

      let district = {
        code: dt[10].split('-')[0] || null,
        name: dt[10].split('-')[1] || null
      }

      let subDistrict = {
        code: dt[9].split('-')[0] || null,
        name: dt[9].split('-')[1] || null
      }

      let village = {
        code: dt[8].split('-')[0] || null,
        name: dt[8].split('-')[1] || null
      }

      let hospital = {
        code: dt[23].split('-')[0] || null,
        name: dt[23].split('-')[1] || null
      }

      let currentDistrict = {
        code: dt[27].split('-')[0] || null,
        name: dt[27].split('-')[1] || null
      }

      let currentSubDistrict = {
        code: dt[26].split('-')[0] || null,
        name: dt[26].split('-')[1] || null
      }

      let currentVillage = {
        code: dt[25].split('-')[0] || null,
        name: dt[25].split('-')[1] || null
      }

      let caseRelated = {
        code: dt[1].split('-')[0] || null,
        name: dt[1].split('-')[1] || null
      }

      let obj = {
        id_case_national: dt[0],
        id_case_related: caseRelated.code,
        name_case_related: caseRelated.name,
        name: dt[3],
        nik: dt[2], //todo
        birth_date: dt[4],
        age: dt[5],
        gender: dt[6] === 'Perempuan' ? 'P' : 'L',
        phone_number: dt[12],
        address_street: dt[7],
        address_province_code: '35',
        address_province_name: 'Jawa Barat',
        address_district_code: district.code,
        address_district_name: district.name,
        address_subdistrict_code: subDistrict.code,
        address_subdistrict_name: subDistrict.name,
        address_village_code: village.code,
        address_village_name: village.name,
        nationality: dt[13],
        nationality_name: dt[14],
        occupation: dt[15],
        office_address: null,            
        status: dt[19],
        stage: dt[20],
        final_result: dt[21],
        report_source: null, //todo
        diagnosis: dt[16].split(','),
        diagnosis_other: null, //todo
        first_symptom_date: null, //todo
        history_tracing: [],
        is_went_abroad: false, //todo
        visited_country: '', //todo
        return_date: null, //todo
        is_went_other_city: false, //todo
        visited_city: null, //todo
        is_contact_with_positive: false, //todo
        history_notes: null, //todo 
        current_location_type: dt[23] ? 'RS' : 'RUMAH',
        current_hospital_id: hospital.code,
        current_location_address: dt[23] ? hospital.name : 'todo home street',
        current_location_district_code: currentDistrict.code,
        current_location_subdistrict_code: currentSubDistrict.code,
        current_location_village_code: currentVillage.code,
        other_notes: null, //todo
        last_changed: new Date(),
        is_sample_taken: !!dt[22] === 'Ya'
      }
      
      for (var key in obj) {
        if(obj[key] && obj[key].trim)
           obj[key] = obj[key].trim()
      }
      
      payload.push(obj)
    }

    fs.unlink(dir + uploaded.filename, (err) => {
        if (err) {
          console.error(err)
          return
        }
    })

    return payload
}

const isDistrictCodeValid = async (code) => {

    const mongoose = require('mongoose')
    const DistrictCity = mongoose.model('Districtcity')
    const district = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code})

    return !!district
}

module.exports = {
    caseSheetExtraction,
    isDistrictCodeValid,
}