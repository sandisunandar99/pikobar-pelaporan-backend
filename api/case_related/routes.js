module.exports = (server) => {
    const handlers = require('./handlers')(server)
    return [
        {
            method: 'GET',
            path: '/case-related',
            config: {
                auth: 'jwt',
                description: 'show case related',
                tags: ['api', 'case related'],
            },
            handler: handlers.caseRelatedList,
        },
    ]
}