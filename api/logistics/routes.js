module.exports = (server) =>{
    const handlers = require('./handlers')(server)

    return [
        // send new request for logistics
        {
            method: 'POST',
            path: '/logistics/requests',
            config: {
                auth: 'jwt',
                description: 'register logistic request',
                tags: ['api', 'logistics'],
                payload: {
                    output: 'stream',
                    allow: 'multipart/form-data' // important
                },
            },
            handler: handlers.RegisterLogisticsRequest
        },

        // list available products
        {
            method: 'GET',
            path: '/logistics/products',
            config: {
                auth: 'jwt',
                description: 'list available logistic products',
                tags: ['api', 'logistics'],
            },
            handler: handlers.ListLogisticProducts
        },

        // product units details
        {
            method: 'GET',
            path: '/logistics/product-units/{id}',
            config: {
                auth: 'jwt',
                description: 'logistic product unit details',
                tags: ['api', 'logistics'],
            },
            handler: handlers.ListLogisticProductUnits
        },

        // list available faskes types
        {
            method: 'GET',
            path: '/logistics/faskes-types',
            config: {
                auth: 'jwt',
                description: 'list availabel faskes types',
                tags: ['api', 'logistics'],
            },
            handler: handlers.ListFaskesType
        },
    ]

}
