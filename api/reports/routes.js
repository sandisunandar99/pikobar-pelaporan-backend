module.exports = (server) =>{
    const handlers = require('./handlers')(server)

    return [
        {
            method: 'GET',
            path: '/reports/daily-report',
            config: {
                auth: 'jwt',
                description: 'Daily report',
                tags: ['api', 'reports.dailyReport'],
            },
            handler: handlers.DailyReport
        }
    ]
}
