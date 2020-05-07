module.exports = (server) =>{
    const handlers = require('./handlers')(server)

    return [
        {
            method: 'POST',
            path: '/logistic-request',
            config: {
                auth: 'jwt',
                description: 'register logistic request',
                tags: ['api', 'logistics'],
            },
            handler: handlers.RegisterLogisticsRequest
        },
    ]

}
