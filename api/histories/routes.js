module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    //const inputValidations = require('./validations/input')
    //const outputValidations = require('./validations/output') 

    const CheckRoleView = require('../cases/route_prerequesites').CheckRoleView(server)
    const CheckRoleCreate = require('../cases/route_prerequesites').CheckRoleCreate(server)
    const CheckRoleUpdate = require('../cases/route_prerequesites').CheckRoleUpdate(server)



    return [
        // Get list history
        {
            method: 'GET',
            path: '/history_cases',
            config: {
                auth: 'jwt',
                description: 'show list of all histories',
                tags: ['api', 'histories'],
                // validate: inputValidations,
                // response: outputValidations
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.ListHistory
        },
        // Create history
        {
            method: 'POST',
            path: '/history_cases',
            config: {
                auth: 'jwt',
                description: 'create new histories',
                tags: ['api', 'histories'],
                // validate: inputValidations,
                // response: outputValidations
                pre: [
                    CheckRoleCreate
                ]
            },
            handler: handlers.CreateHistory
        },
        // Get detail history
        {
            method: 'GET',
            path: '/history_cases/{id}',
            config: {
                auth: 'jwt',
                description: 'show a specific histories details',
                tags: ['api', 'histories'],
                // validate: inputValidations,
                // response: outputValidations
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetHistoryDetail
        },
        // Delete history
        // {
        //     method: 'DELETE',
        //     path: '/history_cases/{id}',
        //     config: {
        //         auth: 'jwt',
        //         description: 'show a specific histories details',
        //         tags: ['api', 'histories'],
        //         // validate: inputValidations,
        //         // response: outputValidations
        //     },
        //     handler: handlers.DeleteHistory
        // }
    ]

}
