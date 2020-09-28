const inputValidations = require('./validations/input')
module.exports = (server) =>{
  const handlers = require('./handlers')(server)
  const CheckRoleCreate = require('../../users/route_prerequesites').CheckRoleCreate(server)
  const countCaseByDistrict = require('../../cases/route_prerequesites').countCaseByDistrict(server)
  const countCasePendingByDistrict = require('../../cases/route_prerequesites').countCasePendingByDistrict(server)

  return [
    {
      method: 'POST',
      path: '/v2/cases',
      config: {
        auth: 'jwt',
        description: 'create new cases',
        tags: [ 'api', 'v2.cases' ],
        validate: inputValidations.RequestPayload,
        pre: [
          CheckRoleCreate,
          countCaseByDistrict,
          countCasePendingByDistrict,
        ]
      },
      handler: handlers.CreateCase
    },
  ]
}
