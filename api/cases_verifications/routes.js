module.exports = (server) =>{
  const handlers = require('./handlers')(server)
  const getCasebyId = require('../cases/route_prerequesites').getCasebyId(server)
  const getDetailCase = require('../cases/route_prerequesites').getDetailCase(server)
  const countCaseByDistrict = require('../cases/route_prerequesites').countCaseByDistrict(server)
  const countCasePendingByDistrict = require('../cases/route_prerequesites').countCasePendingByDistrict(server)

    return [
      // ...All Approval API todo move here
      {
        method: 'PUT',
        path: '/cases/{id}/verifications-revise',
        config: {
          auth: 'jwt',
          description: 'Create case verifications revise',
          tags: ['api', 'cases.verifications'],
          pre: [
            getCasebyId,
            getDetailCase,
            countCaseByDistrict,
            countCasePendingByDistrict
          ]
        },
        handler: handlers.ReviseCaseVerification
      },
      {
        method: 'POST',
        path: '/verifications/submit',
        config: {
          auth: 'jwt',
          description: 'Submit case to verify by dinkes',
          tags: ['api', 'cases.verifications'],
        },
        handler: handlers.SubmitVerifications
      },
    ]
}
