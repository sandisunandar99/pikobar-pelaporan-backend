const keyDashboard = (query, user, time, key) => {
  const { ROLE } = require('../helpers/constant')
  const expireTime = time * 60 * 1000 // 15 minute expire
  let key
  if([ROLE.ADMIN, ROLE.PROVINCE].includes(user.role)){
    key = `${key}${user.username}`
  }else if([ROLE.KOTAKAB].includes(user.role)){
    key = `${key}${user.username}-${user.code_district_city}`
  }else{
    key = `${key}${user.id}-${user.code_district_city}`
  }

  return { key, expireTime }
}

module.exports = {
  keyDashboard
}