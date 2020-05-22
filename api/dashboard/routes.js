module.exports = (server) => {
    const handlers = require('./handlers')(server);
    const inputValidations = require('./validations/input');
    return [
        {
            method: 'GET',
            path: '/dashboard/chart-age-gender',
            config: {
                auth: 'jwt',
                description: 'show dashboard statistik',
                tags: ['api', 'dashboard statistik'],
            },
            handler: handlers.countGenderAge,
        },
        {
            method: 'GET',
            path: '/dashboard/chart-odp',
            config: {
                auth: 'jwt',
                description: 'show dashboard statistik',
                tags: ['api', 'dashboard statistik'],
            },
            handler: handlers.countOdp,
        },
        {
            method: 'GET',
            path: '/dashboard/chart-pdp',
            config: {
                auth: 'jwt',
                description: 'show dashboard statistik',
                tags: ['api', 'dashboard statistik'],
            },
            handler: handlers.countPdp,
        },
        {
            method: 'GET',
            path: '/dashboard/chart-otg',
            config: {
                auth: 'jwt',
                description: 'show dashboard statistik',
                tags: ['api', 'dashboard statistik'],
            },
            handler: handlers.countOtg,
        },
        {
            method: 'GET',
            path: '/dashboard/chart-confirm',
            config: {
                auth: 'jwt',
                description: 'show dashboard statistik',
                tags: ['api', 'dashboard statistik'],
            },
            handler: handlers.countByConfirm,
        },
        {
            method: 'GET',
            path: '/dashboard/tabel-aggregate-criteria',
            config: {
                auth: 'jwt',
                description: 'show dashboard statistik',
                tags: ['api', 'dashboard statistik'],
            },
            handler: handlers.tabelAggregateCriteria,
        },
]
}