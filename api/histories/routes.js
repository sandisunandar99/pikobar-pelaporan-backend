module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    //const inputValidations = require('./validations/input')
    //const outputValidations = require('./validations/output') 

    return [
        // Get list history
        {
            method: 'GET',
            path: '/history_cases',
            config: {
                description: 'show list of all histories',
                tags: ['api', 'histories'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.ListHistory
        },
        // Create history
        {
            method: 'POST',
            path: '/history_cases',
            config: {
                description: 'create new histories',
                tags: ['api', 'histories'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.CreateHistory
        },
        // Get detail history
        {
            method: 'GET',
            path: '/history_cases/{id}',
            config: {
                description: 'show a specific histories details',
                tags: ['api', 'histories'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.GetHistoryDetail
        },
        // Delete history
        {
            method: 'DELETE',
            path: '/history_cases/{id}',
            config: {
                description: 'show a specific histories details',
                tags: ['api', 'histories'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.DeleteHistory
        }
    ]

}
