const validateQueryDashboard = (user, query, unique) => {
  const parseQuery = JSON.stringify(query)
  const toJson = JSON.parse(parseQuery)
  let str = []

  for (let prop in toJson) {
    str.push(toJson[prop])
  }

  const joinStr = str.join('-')

  if(query) {
    key = `${unique}-${user.username}-${joinStr}`
  } else {
    key = `${unique}-${user.username}-${user.code_district_city}`
  }

  return key
}

const keyDashboard = (query, user, time, keys) => {
  const expireTime = time * 60 // rules 1 minute = 60 seconds
  const key = validateQueryDashboard(user, query, keys)

  return { key, expireTime }
}

module.exports = {
  keyDashboard
}