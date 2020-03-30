module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)

    return [
        {
            method: 'GET',
            path: '/category-target',
            config: {
                auth: 'jwt',
                description: 'show category',
                tags: ['api', 'category'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.getListCategory
        }
    ]

}