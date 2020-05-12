module.exports = (server) => {
    const handlers = require('./handlers')(server)
    return [
        {
            method: 'GET',
            path: '/map',
            config: {
                auth: 'jwt',
                description: 'show map statistik',
                tags: ['api', 'map statistik'],
            },
            handler: handlers.mapList,
        },
    ]
}