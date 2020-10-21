const Joi = require('joi')
const helper = require("./handler")
const Case = require('../../../models/Case')
const lang = require('../../dictionary/id.json')
const rules = require('../../../api/v2/cases/validations/input')

const transformedJoiErrors = (joiResult) => {
  if (!joiResult.error) return {}

  const transformedErrors = {}
  const details = joiResult.error.details


  for (let e in details) {
    let errMessage = details[e].message
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
          const rawDesc = fieldErrors[fieldName].join(',')
          desc = transformErrorDescription(rawDesc)
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

const validateNik = async (recordError, nik) => {
  if (nik) {
    const nikExists = await helper.isNikExists(nik)

    if (nikExists) {
      const errField = lang['nik']
      const message = 'Sudah terdata di laporan kasus!'
      if (!Array.isArray(recordError[errField])) {
        recordError[errField] = []
      }
      recordError[errField].push(`\"${errField}"\ '${nik}' ${message}`)
    }
  }

  return recordError
}

const validateDistrictCode = async (recordError, code) => {
  const isDistrictCodeValid = await helper.isDistrictCodeValid(code)

  if (!isDistrictCodeValid) {
    const errField = lang['address_district_code']
    if (!Array.isArray(recordError[errField])) {
      recordError[errField] = []
    }
    recordError[errField].push(`\"${errField}" Kode Kabupaten Salah.`)
  }

  return recordError
}

const validate = async (payload) => {
  const errors = {}

  for (let i = 0; i < payload.length; i++) {
    const joiResult = Joi.validate(payload[i], rules.CaseSheetRequest)

    const recordErrors = []
    let recordError = transformedJoiErrors(joiResult)

    // is address_district_code exist?
    recordError = await validateDistrictCode(recordError, payload[i].address_district_code)

    // Validate duplication NIK
    recordError = await validateNik(recordError, payload[i].nik)

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

const transformErrorDescription = (desc) => {
  if (!desc || !desc.replace) {
    return desc
  }

  const mapObj = {
    'is required': 'Harus diisi',
    'must be a string': 'Harus berisi string',
    'must be a number': 'Harus berisi angka',
    'length must be at least 16 characters long': 'Harus 16 digit',
    'length must be less than or equal to 16 characters long': 'Harus 16 digit',
  }

  const expression = [
    'is required',
    '|must be a string',
    '|must be a number',
    '|length must be at least 16 characters long',
    '|length must be less than or equal to 16 characters long',
  ].join('')

  const result = desc.replace(new RegExp(expression, 'gi'), (matched) => {
    return mapObj[matched]
  })

  return result
}

module.exports = {
  validate,
}
