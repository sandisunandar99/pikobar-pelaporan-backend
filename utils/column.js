let result = []
const dynamicColumnCreate = (method, payload) => {
  for (i in method) {
    result.push({
      [method[i]]: payload[method[i]]
    })
  }

  return Object.assign({}, ...result)

}

const dynamicColumnUpdate = (param, method, payload) => {
  for (i in method) {
    result.push({
      [`${param}${method[i]}`]: payload[method[i]]
    })
  }

  return Object.assign({}, ...result)

}

module.exports = { dynamicColumnCreate, dynamicColumnUpdate }