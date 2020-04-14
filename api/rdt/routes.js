module.exports = (server) =>{
    const handlers = require('./handlers')(server)
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


    return [
        // Get list case for form
        {
            method: 'GET',
            path: '/rdt/list-idcase',
            config: {
                auth: 'jwt',
                description: 'show list id_case for form',
                tags: ['api', 'rdt'],
                pre: [
                    getDataExternal
                ]
            },
            handler: handlers.GetListIdCase
        },
        {
            method: 'GET',
            path: '/rdt/list-idcase-detail',
            config: {
                auth: 'jwt',
                description: 'show list id_case detil',
                tags: ['api', 'rdt'],
                pre:[
                    searchIdcasefromInternal,
                    searchIdcasefromExternal
                ]
            },
            handler: handlers.GetListIdCaseDetail
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
            handler: handlers.ListRdt
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
                    countRdtCode,
                    getCodeDinkes,
                    countCaseByDistrict
                ]
            },
            handler: handlers.CreateRdt
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
            handler: handlers.GetRdtDetail
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
            handler: handlers.UpdateRdt
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
                    getRdtbyId,
                    getCasebyIdcase
                ]
            },
            handler: handlers.DeleteRdt
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
            handler: handlers.GetRdtSummaryByCities
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
            handler: handlers.GetRdtSummaryResultByCities
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
            handler: handlers.GetRdtSummaryResultListByCities
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
            handler: handlers.GetRdtFaskesSummaryByCities
        },

         // Get RDT Test Faskes summary by cities
         {
             method: 'POST',
             path: '/rdt/send-messages',
             config: {
                 auth: 'jwt',
                 description: 'send message sms and whatapp ',
                 tags: ['api', 'rdt']
             },
             handler: handlers.sendMessage
         }

    ]

}
