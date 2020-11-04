module.exports = (server) => {
  const handlers = require('./handlers')
  const inputValidations = require('./validations/input')
  //const outputValidations = require('./validations/output')

  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
  const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
  const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server)

  const countRdtCode = require('./route_prerequesites').countRdtCode(server)
  const getRdtbyId = require('./route_prerequesites').getRdtbyId(server)
  const getCodeDinkes = require('./route_prerequesites').getCodeDinkes(server)
  const checkIfDataNotNull = require('./route_prerequesites').checkIfDataNotNull(server)
  const countCaseByDistrict = require('./route_prerequesites').countCaseByDistrict(server)
  const getCasebyIdcase = require('./route_prerequesites').getCasebyIdcase(server)
  const getDataExternal = require('./route_prerequesites').getDataExternal(server)
  const searchIdcasefromExternal = require('./route_prerequesites').searchIdcasefromExternal(server)
  const searchIdcasefromInternal = require('./route_prerequesites').searchIdcasefromInternal(server)
  const getRegisteredUserfromExternal = require('./route_prerequesites').getRegisteredUserfromExternal(server)
  const validationBeforeInput = require('./route_prerequesites').validationBeforeInput(server)
  const cekHistoryCases = require('./route_prerequesites').cekHistoryCases(server)
  const createHistoryWhenPositif = require('./route_prerequesites').createHistoryWhenPositif(server)

  return [
    // Get list case for form
    {
      method: 'GET',
      path: '/rdt/list-idcase',
      config: {
        auth: 'jwt',
        description: 'show list id_case for form',
        tags: ['api', 'rdt'],
        validate: inputValidations.rdtSearchValidation,
        pre: [
          getDataExternal
        ]
      },
      handler: handlers.GetListIdCase(server)
    },
    {
      method: 'GET',
      path: '/rdt/list-idcase-detail',
      config: {
        auth: 'jwt',
        description: 'show list id_case detil',
        tags: ['api', 'rdt'],
        pre: [
          searchIdcasefromInternal,
          searchIdcasefromExternal
        ]
      },
      handler: handlers.GetListIdCaseDetail(server)
    },
    {
      method: 'GET',
      path: '/rdt/list-registered-user',
      config: {
        auth: 'jwt',
        description: 'show list id_case detil',
        tags: ['api', 'rdt'],
        pre: [
          getRegisteredUserfromExternal
        ]
      },
      handler: handlers.GetListRegisteredUser(server)
    },
    {
      method: 'GET',
      path: '/rdt/list-location-test',
      config: {
        auth: 'jwt',
        description: 'show list location test for form multiple input rdt',
        tags: ['api', 'rdt'],
      },
      handler: handlers.formLocationTest(server)
    },
    // Get list rdt
    {
      method: 'GET',
      path: '/rdt',
      config: {
        auth: 'jwt',
        description: 'show list of all rdt',
        tags: ['api', 'rdt'],
        validate: inputValidations.RdtQueryValidations,
        // response: outputValidations
        pre: [
          CheckRoleView,
          checkIfDataNotNull
        ]
      },
      handler: handlers.ListRdt(server)
    },
    // Create rdt
    {
      method: 'POST',
      path: '/rdt',
      config: {
        auth: 'jwt',
        description: 'create new rdt',
        tags: ['api', 'rdt'],
        pre: [
          CheckRoleCreate,
          // validationBeforeInput,
          countRdtCode,
          // countCaseByDistrict,
          getCodeDinkes,
          cekHistoryCases,
          createHistoryWhenPositif
        ]
      },
      handler: handlers.CreateRdt(server)
    },
    {
      method: 'POST',
      path: '/rdt-multiple',
      config: {
        auth: 'jwt',
        description: 'create new rdt with multiple insert',
        tags: ['api', 'rdt'],
        pre: [
          CheckRoleCreate
        ]
      },
      handler: handlers.CreateRdtMultiple(server)
    },
    // Get detail rdt
    {
      method: 'GET',
      path: '/rdt/{id}',
      config: {
        auth: 'jwt',
        description: 'show a specific rdt details',
        tags: ['api', 'rdt'],
        pre: [
          CheckRoleView
        ]
      },
      handler: handlers.GetRdtDetail(server)
    },

    // Get rdt hostories
    {
      method: 'GET',
      path: '/rdt/{id}/histories',
      config: {
        auth: 'jwt',
        description: 'show a specific rdt details',
        tags: ['api', 'rdt'],
        pre: [
          CheckRoleView
        ]
      },
      handler: handlers.GetRdtHistories(server)
    },

    // Update rdt
    {
      method: 'PUT',
      path: '/rdt/{id}',
      config: {
        auth: 'jwt',
        description: 'update rdt',
        tags: ['api', 'rdt'],
        pre: [
          CheckRoleUpdate
        ]
      },
      handler: handlers.UpdateRdt(server)
    },

    {
      method: 'DELETE',
      path: '/rdt/{id}',
      config: {
        auth: 'jwt',
        description: 'soft delete by id rdt',
        tags: ['api', 'rdt'],
        pre: [
          CheckRoleDelete,
          getRdtbyId
          // getCasebyIdcase
        ]
      },
      handler: handlers.DeleteRdt(server)
    },
    // Get RDT Test summary by cities
    {
      method: 'GET',
      path: '/rdt/summary-by-cities',
      config: {
        auth: 'jwt',
        description: 'Get RDT Test summary by cities',
        tags: ['api', 'rdt']
      },
      handler: handlers.GetRdtSummaryByCities(server)
    },
    // Get RDT result (positif, negatif, invalid) summary by cities
    {
      method: 'GET',
      path: '/rdt/summary-result-by-cities',
      config: {
        auth: 'jwt',
        description: 'Get RDT result summary by cities',
        tags: ['api', 'rdt'],
        pre: [
          CheckRoleView
        ]
      },
      handler: handlers.GetRdtSummaryResultByCities(server)
    },
    // Get RDT used + result (positif, negatif, invalid) summary by cities
    {
      method: 'GET',
      path: '/rdt/summary-result-list-by-cities',
      config: {
        auth: 'jwt',
        description: 'Get RDT result summary list by cities',
        tags: ['api', 'rdt'],
        pre: [
          CheckRoleView
        ]
      },
      handler: handlers.GetRdtSummaryResultListByCities(server)
    },
    // Get RDT Test Faskes summary by cities
    {
      method: 'GET',
      path: '/rdt/faskes-summary-by-cities',
      config: {
        auth: 'jwt',
        description: 'Get RDT Test summary by cities',
        tags: ['api', 'rdt']
      },
      handler: handlers.GetRdtFaskesSummaryByCities(server)
    },
    // send message sms and whatsapps
    {
      method: 'POST',
      path: '/rdt/send-messages',
      config: {
        auth: 'jwt',
        description: 'send message sms and whatapp ',
        tags: ['api', 'rdt']
      },
      handler: handlers.sendMessage(server)
    }

  ]

}