const Joi = require('joi')
const helper = require("./handler")
const Case = require('../../../models/Case')
const lang = require('../../dictionary/id.json')
const rules = require('../../../api/v2/cases/validations/input')

const transformedJoiErrors = (joiResult) => {
  const transformedErrors = {}

  if (joiResult.error) {
    for (let e in joiResult.error.details) {
      let errMessage = joiResult.error.details[e].message
      let errField = errMessage.substr(1, errMessage.lastIndexOf('"')-1)

      // transform field to idn locale lang
      if (errMessage.replace && lang[errField]) {
        errMessage = errMessage.replace(errField, lang[errField])
        errField = lang[errField]
      }

      if (!Array.isArray(transformedErrors[errField])) {
        transformedErrors[errField] = []
      }

      if (!transformedErrors[errField].includes(errMessage)) {
        transformedErrors[errField].push(errMessage)
      }
    }
  }

  return transformedErrors
}

const transformedErrorResponse = (errors) => {
  // transform error response
  const transformed = []
  for (let i in errors) {
    const rowErrors = []

    for (let j in errors[i]) {
      const fieldErrors = errors[i][j] || {}

      for (let fieldName in fieldErrors) {
        let desc = ''
        const transformedFieldErrors = {}
        if (fieldErrors[fieldName].join) {
          desc = fieldErrors[fieldName].join(',')
          if (desc && desc.replace) {
            desc = desc
              .replace('is required', 'Harus diisi')
              .replace('must be a string', 'Harus berisi string')
              .replace('must be a number', 'Harus berisi angka')
              .replace('length must be at least 16 characters long', 'Harus 16 digit')
              .replace('length must be less than or equal to 16 characters long', 'Harus 16 digit')
          }
        }
        transformedFieldErrors.columnName = fieldName
        transformedFieldErrors.description = desc
        rowErrors.push(transformedFieldErrors)
      }

    }

    transformed.push({
      rowNumber: i,
      data: rowErrors,
    })
  }

  return transformed
}

const validate = async (payload) => {
  const errors = {}

  for (let i = 0; i < payload.length; i++) {
    const joiResult = Joi.validate(payload[i], rules.CaseSheetRequest)

    const recordErrors = []
    const recordError = transformedJoiErrors(joiResult)

    // is address_district_code exist?
    const isDistrictCodeValid = await helper.isDistrictCodeValid(
      payload[i].address_district_code
    )

    if (!isDistrictCodeValid) {
      const errField = lang['address_district_code']
      if (!Array.isArray(recordError[errField])) {
        recordError[errField] = []
      }
      recordError[errField].push(`\"${errField}" Kode Kabupaten Salah.`)
    }

    // Validate duplication NIK
    const nik = payload[i].nik;
    if (nik) {
      const isNikExists = await Case
        .findOne({nik: nik, delete_status: { $ne: 'deleted' }})

      if (isNikExists) {
        const errField = lang['nik']
        if (!Array.isArray(recordError[errField])) {
          recordError[errField] = []
        }
        recordError[errField].push(
          `\"${errField}"\ '${nik}' Sudah terdata di laporan kasus!`
        )
      }
    }


    if (Object.keys(recordError).length) {
      recordErrors.push(recordError)
    }

    if (recordErrors.length) {
      const row = (parseInt(i)+1).toString()
      errors[row] = recordErrors
    }
  }

  return transformedErrorResponse(errors)
}

module.exports = {
  validate,
}
