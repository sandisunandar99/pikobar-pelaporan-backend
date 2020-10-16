const validate = async (payload, Joi, rules, config, helper, Case) => {
    let results = []
    let objError = {}
    const label = config.label

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
      let domicileMsg = ''
      if (districtCode && subDistrictCode && villageCode) {
        if (districtCode.substr && subDistrictCode.substr && villageCode.substr) {
          if (subDistrictCode.substr(0,5) != districtCode) {
            let prop = label['address_subdistrict_code']
            domicileMsg = `\"${prop}"\ tidak terdaftar sesuai pada kabupaten yang dipilih.`
            if (!Array.isArray(propErr[prop])) {
              propErr[prop] = []
            }
            propErr[prop].push(domicileMsg)
          }

          if (villageCode.substr(0,8) != subDistrictCode) {
            let prop = label['address_village_code']
            domicileMsg = `\"${prop}"\ tidak terdaftar sesuai pada kecamatan yang dipilih.`
            if (!Array.isArray(propErr[prop])) {
              propErr[prop] = []
            }
            propErr[prop].push(domicileMsg)
          }
        }
      }

      // valid current address code
      const curDistrictCode = payload[i].current_location_district_code
      const curSubDistrictCode = payload[i].current_location_subdistrict_code
      const curVillageCode = payload[i].current_location_village_code

      if (curDistrictCode && curSubDistrictCode && curVillageCode) {
        if (curDistrictCode.substr && curSubDistrictCode.substr && curVillageCode.substr) {
          if (curSubDistrictCode.substr(0,5) != curDistrictCode) {
            let prop = label['current_location_subdistrict_code']
            domicileMsg = `\"${prop}"\ tidak terdaftar sesuai pada kabupaten yang dipilih.`
            if (!Array.isArray(propErr[prop])) {
              propErr[prop] = []
            }
            propErr[prop].push(domicileMsg)
          }

          if (curVillageCode.substr(0,8) != curSubDistrictCode) {
            let prop = label['current_location_village_code']
            domicileMsg = `\"${prop}"\ tidak terdaftar sesuai pada kecamatan yang dipilih.`
            if (!Array.isArray(propErr[prop])) {
              propErr[prop] = []
            }
            propErr[prop].push(domicileMsg)
          }
        }
      }

      // is address_district_code exist?
      const code = payload[i].address_district_code
      const isDistrictCodeValid = await helper.isDistrictCodeValid(code)

      if (!isDistrictCodeValid) {
        let prop = 'address_district_code'
            prop = label[prop]
        let messg = `\"${prop}"\ Kode Kabupaten Salah.`

        if (!Array.isArray(propErr[prop])) {
            propErr[prop] = []
        }
        propErr[prop].push(messg)
      }


      const nik = payload[i].nik
      if (nik) {
        const isCaseExist = await Case.find({nik: nik})
          .where('delete_status').ne('deleted')
          .countDocuments()

        if (isCaseExist) {
          let prop = 'nik'
          prop = label[prop]
          let messg = `\"${prop}"\ '${nik}' Sudah terdata di laporan kasus!`

          if (!Array.isArray(propErr[prop])) {
              propErr[prop] = []
          }
          propErr[prop].push(messg)
        }
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
            if (desc && desc.replace) {
              desc = desc.replace('is required', 'Harus diisi')
              desc = desc.replace('must be a string', 'Harus berisi string')
              desc = desc.replace('must be a number', 'Harus berisi angka')
              desc = desc.replace('length must be at least 16 characters long', 'Harus 16 digit')
              desc = desc.replace('length must be less than or equal to 16 characters long', 'Harus 16 digit')
            }
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
