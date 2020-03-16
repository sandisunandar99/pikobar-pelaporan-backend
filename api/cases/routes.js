module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    //const inputValidations = require('./validations/input')
    //const outputValidations = require('./validations/output') 

    return [
        // Get list case
        {
            method: 'GET',
            path: '/cases',
            config: {
                description: 'show list of all cases',
                tags: ['api', 'cases'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.ListCase
        },
        // Create case
        {
            method: 'POST',
            path: '/cases',
            config: {
                description: 'create new cases',
                tags: ['api', 'cases'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.CreateCase
        },
        // Get detail case
        {
            method: 'GET',
            path: '/cases/{id}',
            config: {
                description: 'show a specific cases details',
                tags: ['api', 'cases'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.GetCaseDetail
        },
        // Get case's history
        {
            method: 'GET',
            path: '/cases/{id}/history',
            config: {
                description: 'show a specific cases history',
                tags: ['api', 'cases'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.GetCaseHistory
        },
        // Update case
        {
            method: 'PUT',
            path: '/cases/{id}',
            config: {
                description: 'show a specific cases details',
                tags: ['api', 'cases'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.UpdateCase
        },
        // Delete case
        {
            method: 'DELETE',
            path: '/cases/{id}',
            config: {
                description: 'show a specific cases details',
                tags: ['api', 'cases'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.DeleteCase
        }
    ]

}
