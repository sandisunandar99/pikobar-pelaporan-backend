const config = require('./config.json')
const lang = require('../../dictionary/id.json')

const _toString = (value) => {
  if (value && value.toString) return value.toString()
  return value
}
const _toDateString = (value) => {
  if (!value) return null
  return new Date((value - (25567 + 1))*86400*1000) || null
}
const _toUnsignedInt = (value) => {
  if (value && value.parseToInt) return Math.abs(value.parseToInt())
  else if (value && typeof value === 'number') return Math.abs(value)
  return value
}

const getStringValueByIndex = (value, index) => {
  if (!value) return null
  return _toString(value.split('-')[index] || null)
}

const requestFileError = (payload) => {
  let error = false
  const useTemplateVersioning = false

  if (payload === config.unverified_template && useTemplateVersioning) {
    error = lang.messages.unverified_template
  } else if (payload === config.version_out_of_date && useTemplateVersioning) {
    error = lang.messages.version_out_of_date
  }else if (payload.length > config.max_rows_allowed) {
    error = `Maksimal import kasus adalah ${config.max_rows_allowed} baris`
  }

  return error
}

/**
* compare data in 1 millisecond
* if different means the case is in the process of insertion by another process
* to remember, this is only a temporary method to prevent :)
*/
const isAnotherImportProcessIsRunning = async (schema) => {
  const delay = (t) => {
    return new Promise(resolve => setTimeout(resolve.bind(), t))
  }

  const totalOne = await schema.find().countDocuments()
  promise = delay(100)
  const totalTwo = await schema.find().countDocuments()
  if (totalOne !== totalTwo) return true;

  return false
}

const isTemplateVerified = (dataSheet) => {

  const verfiedTemplate = config.verified_template
  if (dataSheet[1][34] !== verfiedTemplate
    || dataSheet[2][34] !== verfiedTemplate
    || dataSheet[3][34] !== verfiedTemplate
    || dataSheet[4][34] !== verfiedTemplate ) {
    return false
  }

  return true
}

const getTransformedAge = (age) => {
  if (!age) return null
  const a = _toUnsignedInt(age) || '0'
  return _toString(a)
}

const getArrayValues = (reference, cellString) => {
  const unknown = []
  const registered = []
  const cellArray = cellString ? cellString.split(',') : []

  for (let i = 0; i < cellArray.length; i++) {
      if (!_toString(cellArray[i])) continue;
      const val = _toString(cellArray[i]).trim().toLowerCase()

      if (reference.includes(val)) registered.push(val);
      else unknown.push(val);
  }

  return {
    registered,
    unknown,
  }
}

const getUnknownValuesOfArray = (cellValue, unknownArrs) => {
  let value = _toString(cellValue)
  if (!unknownArrs.join) return null

  if (value) {
    value += ' ' + unknownArrs.join(',')
  } else {
    value = unknownArrs.join(',')
  }

  return value
}

const yesNoUnknown = (value) => {
  let res = 3

  if (value) {
    value = value.toLowerCase()
  }

  switch (value) {
    case 'ya':
      res = 1
      break;
    case 'tidak':
      res = 2
      break;
    default:
      res = 3
  }

  return res
}

const trueOrFalse = (v) => {
  if (v.toLowerCase) { v = v.toLowerCase() }
  return v === 'ya memiliki'
}

const modules = {
  _toString,
  _toDateString,
  _toUnsignedInt,
  trueOrFalse,
  yesNoUnknown,
  getArrayValues,
  requestFileError,
  getTransformedAge,
  isTemplateVerified,
  getStringValueByIndex,
  getUnknownValuesOfArray,
  isAnotherImportProcessIsRunning,
}

module.exports = modules
