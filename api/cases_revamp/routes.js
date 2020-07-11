module.exports = (server) =>{
    const handlers = require('./handlers')(server);
    const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server);
    const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server);
    const countCaseByDistrict = require('../cases/route_prerequesites').countCaseByDistrict(server);
    const countCasePendingByDistrict = require('../cases/route_prerequesites').countCasePendingByDistrict(server);

    return [
        {
            method: 'POST',
            path: '/cases-revamp',
            config: {
                auth: 'jwt',
                description: 'create new cases revamp',
                tags: ['api', 'cases_revamp'],
                pre: [
                    CheckRoleCreate,
                    countCaseByDistrict,
                    countCasePendingByDistrict,
                ]
            },
            handler: handlers.CreateCaseRevamp
        },
        {
            method: 'GET',
            path: '/cases-revamp/check',
            config: {
                auth: 'jwt',
                description: 'check if existing with params',
                tags: ['api', 'cases_revamp'],
            },
            handler: handlers.CheckIfExisting
        },
        {
            method: 'POST',
            path: '/cases-revamp/{id}/contact',
            config: {
                auth: 'jwt',
                description: 'create new close contact only',
                tags: ['api', 'cases_revamp'],
                pre: [
                    CheckRoleCreate,
                ]
            },
            handler: handlers.CreateCloseContact
        },
        {
            method: 'PUT',
            path: '/cases-revamp/{id}/contact',
            config: {
                auth: 'jwt',
                description: 'update close contact only',
                tags: ['api', 'cases_revamp'],
                pre: [
                    CheckRoleUpdate,
                ]
            },
            handler: handlers.UpdateloseContact
        },
    ]
}
