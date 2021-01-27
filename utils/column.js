const modules = require("../api/cases/validations/input")

let result = []
const loopsDynamicColumn = (method, payload) => {
  for (i in method) {
    result.push({
      [method[i]]: payload[method[i]]
    })
  }

  return Object.assign({}, ...result)

}

module.exports = { loopsDynamicColumn }