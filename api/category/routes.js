module.exports = (server) =>{
    const handlers = require('./handlers')(server)

    return [
        {
            method: 'GET',
            path: '/category',
            config: {
                auth: 'jwt',
                description: 'show category',
                tags: ['api', 'category'],
            },
            handler: handlers.getListCategory
        }
    ]

}