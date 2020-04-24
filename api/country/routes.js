module.exports = (server) => {
    const handlers = require('./handlers')(server)
    return [{
        method: 'GET',
        path: '/country',
        config: {
            auth: 'jwt',
            description: 'show occupations',
            tags: ['api', 'occupations'],
        },
        handler: handlers.listCountry
    }]
}