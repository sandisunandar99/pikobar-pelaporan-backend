const Joi = require('joi')
const Case = require('../models/Case')
const helper = require("./casesheetextraction")
const config = require('./casesheetconfig.json')
const rules = require('../../api/cases/validations/input')

const districtPatternValidate = (districtCode, subDistrictCode, villageCode) => {
  const err = {}
  const isAllFilled = districtCode && subDistrictCode && villageCode
  const includeStr = districtCode.substr && subDistrictCode.substr && villageCode.substr
  let domicileMsg = ''
  const districtPatternValid = (subCcode, code, offset, key, messg) => {
    if (subCcode.substr(0, offset) != code) {
      let prop = label[key]
      domicileMsg = `\"${prop}"\ ${messg}.`

      if (!Array.isArray(err[prop])) {
        err[prop] = []
      }
      err[prop].push(domicileMsg)
    }
  }

  if (isAllFilled && includeStr) {
    districtPatternValid(
      subDistrictCode,
      districtCode,
      5,
      'current_location_subdistrict_code',
      'tidak terdaftar sesuai pada kabupaten yang dipilih'
    )

    districtPatternValid(
      villageCode,
      subDistrictCode,
      5,
      'current_location_village_code',
      'tidak terdaftar sesuai pada kecamatan yang dipilih'
    )
  }

  return err
}

const validate = async (payload) => {
  const results = []
  const objError = {}
  const label = config.label

  for (let i = 0; i < payload.length; i++) {
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
    districtPatternValidate(
      payload[i].address_district_code,
      payload[i].address_subdistrict_code,
      payload[i].address_village_code,
    )

    districtPatternValidate(
      payload[i].current_location_district_code,
      payload[i].current_location_subdistrict_code,
      payload[i].current_location_village_code,
    )

    // is address_district_code exist?
    const code = payload[i].address_district_code
    const isDistrictCodeValid = await helper.isDistrictCodeValid(code)

    if (!isDistrictCodeValid) {
      let prop = label['address_district_code']
      let messg = `\"${prop}"\ Kode Kabupaten Salah.`

      if (!Array.isArray(propErr[prop])) { propErr[prop] = [] }
      propErr[prop].push(messg)
    }


    const nik = payload[i].nik
    if (nik) {
      const isCaseExist = await Case.find({nik: nik})
        .where('delete_status').ne('deleted')
        .countDocuments()

      if (isCaseExist) {
        let prop = label['nik']
        let messg = `\"${prop}"\ '${nik}' Sudah terdata di laporan kasus!`

        if (!Array.isArray(propErr[prop])) { propErr[prop] = [] }
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
