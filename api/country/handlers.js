const {
  replyJson
} = require('../helpers')

const listCountry = (server) => {
  return (request, reply) => {
    server.methods.services.country.getCountryList(
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}


const listMenu = (server) => {
  return (request, reply) => {
    server.methods.services.country.getMenuList(
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

module.exports = {
  listCountry, listMenu
}

// module.exports = (server) => {
//     return {
//     } //end
// }