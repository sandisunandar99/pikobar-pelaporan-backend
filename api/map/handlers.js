const { requestIfSame } = require('../../helpers/request')

/**
 * /api/map
 * @param {*} request
 * @param {*} reply
*/

const mapList = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "map", "listMap",
      request, reply
    )
  }
}
module.exports = {
  mapList
}