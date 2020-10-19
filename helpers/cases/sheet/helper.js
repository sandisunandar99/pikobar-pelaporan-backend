const config = require('./config.json')

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

const getStringCode = (value) => {
  if (!value) return null
  return _toString(value.split('-')[1] || null)
}

const requestFileError = (payload) => {
  let error = false

  if (payload === config.unverified_template) {
    error = config.messages.unverified_template
  } else if (payload === config.version_out_of_date) {
    error = config.messages.version_out_of_date
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


module.exports = {
  _toString,
  _toDateString,
  _toUnsignedInt,
  getStringCode,
  requestFileError,
  isAnotherImportProcessIsRunning,
}
