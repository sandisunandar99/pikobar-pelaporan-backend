const validate = async (payload, Joi, rules, label, helper, Case) => {
    let results = []
    let objError = {}

    for (let i in payload) {
      let propErr = {}
      let errors = []

      const result = Joi.validate(payload[i], rules.caseSchemaValidation)
    
      if (result.error!==null) {
        for (e in result.error.details) {
            let messg = result.error.details[e].message
            let prop = messg.substr(1, messg.lastIndexOf('"')-1)

            // transform label
            if (messg.replace && label[prop]) {
                messg = messg.replace(prop, label[prop])
                prop = label[prop]
            }

            if (!Array.isArray(propErr[prop])) {
                propErr[prop] = []
            }

            if (propErr[prop].includes) {
                if (propErr[prop].includes(messg)) {
                    continue
                }
            }

            propErr[prop].push(messg)
        }   
      }

      // valid domicile code
      const districtCode = payload[i].address_district_code
      const subDistrictCode = payload[i].address_subdistrict_code
      const villageCode = payload[i].address_village_code
      if (districtCode.substr && subDistrictCode.substr && villageCode.substr) {
        if (subDistrictCode.substr(0,5) != districtCode) {
          let prop = label['address_subdistrict_code']
          domicileMsg = `\"${prop}"\ Not registered in selected "Kabupaten"`
          if (!Array.isArray(propErr[prop])) {
            propErr[prop] = []
          }
          propErr[prop].push(domicileMsg)
        }

        if (villageCode.substr(0,8) != subDistrictCode) {
          let prop = label['address_village_code']
          domicileMsg = `\"${prop}"\ Not registered in selected "Kecamatan"`
          if (!Array.isArray(propErr[prop])) {
            propErr[prop] = []
          }
          propErr[prop].push(domicileMsg)
        }
      }

      // valid current address code
      const curDistrictCode = payload[i].current_location_district_code
      const curSubDistrictCode = payload[i].current_location_subdistrict_code
      const curVillageCode = payload[i].current_location_village_code
      let domicileMsg = ''
      if (curDistrictCode.substr && curSubDistrictCode.substr && curVillageCode.substr) {
        if (curSubDistrictCode.substr(0,5) != curDistrictCode) {
          let prop = label['current_location_subdistrict_code']
          domicileMsg = `\"${prop}"\ Not registered in selected "Kabupaten"`
          if (!Array.isArray(propErr[prop])) {
            propErr[prop] = []
          }
          propErr[prop].push(domicileMsg)
        }

        if (curVillageCode.substr(0,8) != curSubDistrictCode) {
          let prop = label['current_location_village_code']
          domicileMsg = `\"${prop}"\ Not registered in selected "Kecamatan"`
          if (!Array.isArray(propErr[prop])) {
            propErr[prop] = []
          }
          propErr[prop].push(domicileMsg)
        }
      }

      // is address_district_code exist?
      const code = payload[i].address_district_code
      const isDistrictCodeValid = await helper.isDistrictCodeValid(code)
      
      if (!isDistrictCodeValid) {
        let prop = 'address_district_code'
            prop = label[prop]
        let messg = `\"${prop}"\ Invalid/Not found`

        if (!Array.isArray(propErr[prop])) {
            propErr[prop] = []
        }
        propErr[prop].push(messg)
      }

      const nik = payload[i].nik
      const isCaseExist = await Case.find({nik: nik}).countDocuments()

      if (isCaseExist) {
        let prop = 'nik'
        prop = label[prop]
        let messg = `\"${prop}"\ Already exists`

        if (!Array.isArray(propErr[prop])) {
            propErr[prop] = []
        }
        propErr[prop].push(messg)
      }

      if (Object.keys(propErr).length !== 0) {
        errors.push(propErr)
      }

      if (errors.length) {
        objError[(parseInt(i)+9).toString()] = errors
      }
    }

    // transform error response
    for (i in objError) {
      let rowDetail = {}
      let rowErrors = []
      let err = objError[i] || []

      for (j in err) {
        let errs = err[j] || {}
        
        for (k in errs) {
          let desc = ''
          let  transform = {}
          if (errs[k].join) {
            desc = errs[k].join(',')
          }
          transform.columnName = k
          transform.description = desc
          rowErrors.push(transform)
        }

      }
      
      rowDetail.rowNumber = i
      rowDetail.data = rowErrors
      results.push(rowDetail)
    }

    return results
}

module.exports = {
    validate,
}