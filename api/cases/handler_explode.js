const { funcCreateDynamic } = require('../../helpers/request')

const multipleUpdateCase = (server) => {
  return async(request, reply) => {
    await funcCreateDynamic(
      server, 'cases_other', 'multipleUpdate',
      request, 'payload', 'auth.credentials.user', reply)
  }
}

module.exports = {
  multipleUpdateCase
}