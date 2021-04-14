const validateQuery = (user, query, unique, nameOne, nameTwo) => {
  let key
  if(query[nameOne]) {
    key = `${unique}-${user.username}-${query[nameOne]}`
  } else if (query[nameOne] && query[nameTwo]) {
    key = `${unique}-${user.username}-${query[nameOne]}-${query[nameTwo]}`
  } else {
    key = `${unique}-${user.username}-${user.code_district_city}`
  }

  return key
}

const keyDashboard = (query, user, time, keys) => {
  const expireTime = time * 60 // rules 1 minute = 60 seconds
  const key = validateQuery(
    user, query, keys, 'address_subdistrict_code', 'address_village_code'
  )

  return { key, expireTime }
}

module.exports = {
  keyDashboard
}