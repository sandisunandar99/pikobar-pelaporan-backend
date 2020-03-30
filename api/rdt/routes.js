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
                pre: [
                    CheckRoleCreate,
                    countRdtCode
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
                description: 'show a specific rdt details',
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
                    getRdtbyId
                ]
            },
            handler: handlers.DeleteRdt
        }
    ]

}
