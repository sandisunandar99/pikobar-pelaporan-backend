const config = require('./casesheetconfig.json')

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

module.exports = {
  requestFileError,
}
