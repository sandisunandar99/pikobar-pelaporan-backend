module.exports = (server) => {
    const handlers = require('./handlers')(server)
    return [{
        method: 'GET',
        path: '/dashboard',
        config: {
            auth: 'jwt',
            description: 'show dashboard statistik',
            tags: ['api', 'dashboard statistik'],
        },
        handler: handlers.countGender,
    }]
}