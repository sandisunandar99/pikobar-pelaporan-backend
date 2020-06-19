module.exports = (server) =>{
    const handlers = require('./handlers')(server);
    const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server);
    const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server);
    
    return [
        {
            method: 'GET',
            path: '/history_cases',
            config: {
                auth: 'jwt',
                description: 'show list of all histories',
                tags: ['api', 'histories'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.ListHistory
        },
        {
            method: 'POST',
            path: '/history_cases',
            config: {
                auth: 'jwt',
                description: 'create new histories',
                tags: ['api', 'histories'],
                pre: [
                    CheckRoleCreate
                ]
            },
            handler: handlers.CreateHistory
        },
        {
            method: 'GET',
            path: '/history_cases/{id}',
            config: {
                auth: 'jwt',
                description: 'show a specific histories details',
                tags: ['api', 'histories'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetHistoryDetail
        },
    ]
}
