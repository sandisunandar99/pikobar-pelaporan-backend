module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    const inputValidations = require('./validations/input')
    //const outputValidations = require('./validations/output')

    const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
    const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
    const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
    const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server)
    
    const countRdtByDistrict = require('./route_prerequesites').countRdtByDistrict(server)
    const getRdtbyId = require('./route_prerequesites').getRdtbyId(server)


    return [
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
                    CheckRoleView
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
                // validate: inputValidations,
                // response: outputValidations
                // pre: [
                //     CheckRoleCreate,
                //     countRdtByDistrict
                // ]
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
                // validate: inputValidations,
                // response: outputValidations
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetRdtDetail
        },
        // Get rdt's history
        {
            method: 'GET',
            path: '/rdt/{id}/history',
            config: {
                auth: 'jwt',
                description: 'show a specific rdt history',
                tags: ['api', 'rdt'],
                // validate: inputValidations,
                // response: outputValidations
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetRdtHistory
        },

        // Get last history of rdt
        {
            method: 'GET',
            path: '/rdt/{id}/last-history',
            config: {
                auth: 'jwt',
                description: 'show the last history of rdt',
                tags: ['api', 'rdt'],
                // validate: inputValidations,
                // response: outputValidations
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetRdtHistoryLast
        },

        // Get rdt's summary of last status
        {
            method: 'GET',
            path: '/rdt-summary',
            config: {
                auth: 'jwt',
                description: 'Get rdt summary of last status',
                tags: ['api', 'rdt'],
                // validate: inputValidations,
                // response: outputValidations
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetRdtSummary
        },

        // Update rdt
        {
            method: 'PUT',
            path: '/rdt/{id}',
            config: {
                auth: 'jwt',
                description: 'show a specific rdt details',
                tags: ['api', 'rdt'],
                // validate: inputValidations,
                // response: outputValidations
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
                // validate: inputValidations,
                // response: outputValidations
                pre: [
                    CheckRoleDelete,
                    getRdtbyId
                ]
            },
            handler: handlers.DeleteRdt
        }
    ]

}
