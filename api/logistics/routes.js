module.exports = (server) =>{
    const handlers = require('./handlers')(server)

    return [
        {
            method: 'POST',
            path: '/logistics/requests',
            config: {
                auth: 'jwt',
                description: 'register logistic request',
                tags: ['api', 'logistics'],
            },
            handler: handlers.RegisterLogisticsRequest
        },
    ]

}
