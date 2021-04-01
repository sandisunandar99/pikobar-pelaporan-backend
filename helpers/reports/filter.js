const { ROLE } = require('../constant')

validateQuery = (key, query, user, param) => {
  if(query[param]) {
    key = `daily-reports-${user.username}-${query[param]}`
  } else {
    key = `daily-reports-${user.username}`
  }

  return key
}

validateAdminQuery = (key, query, user) => {
  if(query.date && query.address_district_code) {
    key = `daily-reports-${user.username}-${query.date}-${query.address_district_code}`
  } else if(query.address_district_code) {
    key = `daily-reports-${user.username}-${query.address_district_code}`
  } else if(query.date) {
    key = `daily-reports-${user.username}-${query.date}`
  } else {
    key = `daily-reports-${user.username}`
  }

  return key
}

const setKeyReport = (query, user) => {
  let key
  if(user.role === ROLE.ADMIN) {
    key = validateAdminQuery(key, query, user)
  } else {
    key = validateQuery(key, query, user, 'date')
  }

  return key
}

module.exports = { setKeyReport }
