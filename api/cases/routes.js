module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    const inputValidations = require('./validations/input')
    const outputValidations = require('./validations/output')

    const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
    const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
    const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
    const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server)
    
    const countCaseByDistrict = require('./route_prerequesites').countCaseByDistrict(server)
    const checkIfDataNotNull = require('./route_prerequesites').checkIfDataNotNull(server)
    const getCasebyId = require('./route_prerequesites').getCasebyId(server)
    const DataSheetRequest = require('./route_prerequesites').DataSheetRequest(server)
    const validationBeforeInput = require('./route_prerequesites').validationBeforeInput(server)
    const checkCaseIsExists = require('./route_prerequesites').checkCaseIsExists(server)


    return [
        // Get list case
        {
            method: 'GET',
            path: '/cases',
            config: {
                auth: 'jwt',
                description: 'show list of all cases',
                tags: ['api', 'cases'],
                validate: inputValidations.CaseQueryValidations,
                response: outputValidations.ListCaseOutputValidationsConfig,
                pre: [
                    CheckRoleView,
                    checkIfDataNotNull
                ]
            },
            handler: handlers.ListCase
        },
        // Create case
        {
            method: 'POST',
            path: '/cases',
            config: {
                auth: 'jwt',
                description: 'create new cases',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleCreate,
                    validationBeforeInput,
                    countCaseByDistrict,
                    checkCaseIsExists
                ]
            },
            handler: handlers.CreateCase
        },
        // Get detail case
        {
            method: 'GET',
            path: '/cases/{id}',
            config: {
                auth: 'jwt',
                description: 'show a specific cases details',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseDetail
        },
        // Get case's history
        {
            method: 'GET',
            path: '/cases/{id}/history',
            config: {
                auth: 'jwt',
                description: 'show a specific cases history',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseHistory
        },

        // Get last history of case
        {
            method: 'GET',
            path: '/cases/{id}/last-history',
            config: {
                auth: 'jwt',
                description: 'show the last history of case',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseHistoryLast
        },

        // Get case's summary of last status
        {
            method: 'GET',
            path: '/cases-summary',
            config: {
                auth: 'jwt',
                description: 'Get cases summary of last status',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseSummary
        },

        // Get case's summary of last status
        {
            method: 'GET',
            path: '/cases-summary-final',
            config: {
                auth: 'jwt',
                description: 'Get cases summary of final result',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseSummaryFinal
        },

        // Get case's summary of last status
        {
            method: 'GET',
            path: '/cases-summary-by-district',
            config: {
                auth: 'jwt',
                description: 'Get count summary of all cases by district',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseSummaryByDistrict
        },

        // Export excell case
        {
            method: 'GET',
            path: '/cases-export',
            config: {
                auth: 'jwt',
                description: 'Get count summary of all cases by district',
                tags: ['api', 'cases']
            },
            handler: handlers.ListCaseExport
        },

        // Update case
        {
            method: 'PUT',
            path: '/cases/{id}',
            config: {
                auth: 'jwt',
                description: 'show a specific cases details',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleUpdate
                ]
            },
            handler: handlers.UpdateCase
        },
        {
            method: 'DELETE',
            path: '/cases/{id}',
            config: {
                auth: 'jwt',
                description: 'soft delete by id cases',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleDelete,
                    getCasebyId
                ]
            },
            handler: handlers.DeleteCase
        },
        // Import excel case
        {
            method: 'POST',
            path: '/cases-import',
            config: {
                auth: 'jwt',
                description: 'Cases import',
                tags: ['api', 'cases'],
                validate: inputValidations.CaseImportPayloadValidations,
                payload: {
                    maxBytes: 1000 * 1000 * 25,
                    output: 'stream',
                    parse: true,
                    allow: 'multipart/form-data'
                },
                pre: [
                    CheckRoleCreate,
                    DataSheetRequest,
                ]
            },
            handler: handlers.ImportCases
        },
        // Get case name and id
        {
            method: 'GET',
            path: '/cases-listid',
            config: {
                auth: 'jwt',
                description: 'Get case name and id',
                tags: ['api', 'cases']
            },
            handler: handlers.GetIdCase
        },
    ]

}
