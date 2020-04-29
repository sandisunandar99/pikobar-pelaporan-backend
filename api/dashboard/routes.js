module.exports = (server) => {
    const handlers = require('./handlers')(server)
    return [
        {
            method: 'GET',
            path: '/dashboard/chart-age-gender',
            config: {
                auth: 'jwt',
                description: 'show dashboard statistik',
                tags: ['api', 'dashboard statistik'],
            },
            handler: handlers.countGender,
        },
        {
            method: 'GET',
            path: '/dashboard/chart-odp',
            config: {
                auth: 'jwt',
                description: 'show dashboard statistik',
                tags: ['api', 'dashboard statistik'],
            },
            handler: handlers.countODP,
        },
        {
            method: 'GET',
            path: '/dashboard/chart-pdp',
            config: {
                auth: 'jwt',
                description: 'show dashboard statistik',
                tags: ['api', 'dashboard statistik'],
            },
            handler: handlers.countPDP,
        },
        {
            method: 'GET',
            path: '/dashboard/chart-otg',
            config: {
                auth: 'jwt',
                description: 'show dashboard statistik',
                tags: ['api', 'dashboard statistik'],
            },
            handler: handlers.countOTG,
        }
]
}