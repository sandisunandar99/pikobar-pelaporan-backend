'use strict'
const { userByRole } = require('../rolecheck')
const { ROLE } = require('../constant')

const filterRole = (query, user, name) => {
  const params = {}
  if (user.role === ROLE.PROVINCE || user.role === ROLE.ADMIN) {
    if (query[name]) params[name] = query[name]
  }

  return params
}

const filterUser = (query, user) => {
  const byRole = userByRole({}, user)
  const params = {...byRole, ...filterRole(query, user, 'code_district_city')}
  if (query.role) params.role = query.role
  if (query.address_village_code) params.address_village_code = query.address_village_code
  if (query.address_subdistrict_code) {
    params.address_subdistrict_code = query.address_subdistrict_code
  }
  return params
}

const searchUser = (query) => {
  let search_params
  if (query.search) {
    search_params = [
      { username: new RegExp(query.search, "i") },
      { fullname: new RegExp(query.search, "i") },
      { email: new RegExp(query.search, "i") },
      { phone_number: new RegExp(query.search, "i"), },
      { address_street: new RegExp(query.search, "i"), },
      { address_village_name: new RegExp(query.search, "i"), },
    ]
  } else {
    search_params = {}
  }
  return search_params
}

module.exports = {
  filterUser, searchUser, filterRole
}