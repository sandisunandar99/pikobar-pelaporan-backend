const inputValidations = require('./validations/input')

module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    const getCloseContactbyId = require('./route_prerequesites').getCloseContactbyId(server)
    const getReportbyCloseContactId = require('./route_prerequesites').getReportbyCloseContactId(server)

    return [
        {
            method: 'POST',
            path: '/close-contacts/{closeContactId}/report',
            config: {
                auth: 'jwt',
                description: 'create new close contacts report',
                tags: ['api', 'cases', 'close.contacts.reports'],
                validate: inputValidations.RequestPayload,
                pre: [ getCloseContactbyId ]
            },
            handler: handlers.CreateCloseContactReport
        },
        {
            method: 'PUT',
            path: '/close-contacts/{closeContactId}/report',
            config: {
                auth: 'jwt',
                description: 'create new close contacts',
                tags: ['api', 'cases', 'close.contacts'],
                validate: inputValidations.RequestPayload,
                pre: [
                    getCloseContactbyId,
                    getReportbyCloseContactId
                ]
            },
            handler: handlers.UpdateCloseContactReport
        },
        {
            method: 'GET',
            path: '/close-contacts/{closeContactId}/report',
            config: {
                auth: 'jwt',
                description: 'show a specific close contact',
                tags: ['api', 'cases', 'close.contacts'],
                pre: [ getCloseContactbyId ]
            },
            handler: handlers.DetailCloseContactReport
        }
    ]
}
