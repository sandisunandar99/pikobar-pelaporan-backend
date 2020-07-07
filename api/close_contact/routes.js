const inputValidations = require('./validations/input')
const reportInputValidations = require('../close_contact_report/validations/input')

module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    const getCasebyId = require('./route_prerequesites').getCasebyId(server)

    return [
        {
            method: 'GET',
            path: '/cases/{caseId}/close-contacts',
            config: {
                auth: 'jwt',
                description: 'show list of all close-contacts',
                tags: ['api', 'cases', 'close.contacts']
            },
            handler: handlers.ListCloseContactCase
        },
        {
            method: 'POST',
            path: '/cases/{caseId}/close-contacts',
            config: {
                auth: 'jwt',
                description: 'create new close contacts',
                tags: ['api', 'cases', 'close.contacts'],
                validate: inputValidations.RequestPayload,
                pre: [ getCasebyId ]
            },
            handler: handlers.CreateCloseContact
        },
        {
            method: 'POST',
            path: '/cases/{caseId}/close-contacts-with-report',            
            config: {
                auth: 'jwt',
                description: 'create new close contacts',
                tags: ['api', 'cases', 'close.contacts'],
                validate: reportInputValidations.RequestPayload,
                pre: [ getCasebyId ]
            },
            handler: handlers.CreateCloseContactWithReport
        },
        {
            method: 'DELETE',
            path: '/cases/{caseId}/close-contacts/{id}',
            config: {
                auth: 'jwt',
                description: 'show a specific cases history',
                tags: ['api', 'cases', 'close.contacts'],
                pre: [ getCasebyId ]
            },
            handler: handlers.DeleteCloseContact
        }
    ]
}
