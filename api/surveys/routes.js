module.exports = (server) =>{
    const handlers = require('./handlers')(server)    
    const inputValidations = require('./validations/input')
    const outputValidations = require('./validations/output')
    const fetchSurvey = require('./routes_prerequesites').fetchSurvey(server)
    const authorizeSurvey = require('./routes_prerequesites').authorizeSurvey(server)

    return [
        {
            method: 'GET',
            path: '/surveys',
            config:{
                auth: 'jwt',
                validate: inputValidations.SurveyQueryValidations,
                response: outputValidations.ListSurveyOutputValidationsConfig, 
                description: 'Get list survey',
                tags:['api','surveys']
            },
            handler: handlers.getListSurvey
        },
        {
            method: 'POST',
            path: '/surveys',
            config: {
                auth: 'jwt',
                validate: inputValidations.SurveyCreatePayloadValidations,
                response: outputValidations.SurveyOnPostOutputValidationsConfig, 
                description: 'Create survey',
                tags: ['api', 'surveys']
            },
            handler: handlers.createSurvey
        },
        {
            method: 'DELETE',
            path: '/surveys/{id}',
            config: {
                auth: 'jwt',
                description: 'Delete survey',
                tags: ['api', 'surveys'],
                pre: [
                    fetchSurvey
                ],
                validate: inputValidations.SurveyDeletePayloadValidations,
                response: outputValidations.SurveyOnDeleteOutputValidationsConfig,
            },
            handler: handlers.deleteSurvey
        },
        {
            method: 'PUT',
            path: '/surveys/{id}',
            config: {
                auth: 'jwt',
                description: 'update survey',
                tags: ['api', 'surveys'],
                pre: [
                    fetchSurvey
                ],
                validate: inputValidations.SurveyUpdatePayloadValidations,
                response: outputValidations.SurveyOnPutOutputValidationsConfig,
            },
            handler: handlers.updateSurvey
        },
        {
            method: 'DELETE',
            path: '/surveys/{id}/delete',
            config: {
                auth: 'jwt',
                description: 'soft Delete survey',
                tags: ['api', 'surveys'],
                pre: [
                    fetchSurvey
                ],
                validate: inputValidations.SurveySoftDeletePayloadValidations,
                response: outputValidations.SurveyOnPutOutputValidationsConfig,
            },
            handler: handlers.softDeleteSurvey
        },
        {
            method: 'GET',
            path: '/surveys/{id}',
            config: {
                auth: 'jwt',
                description: 'Get survey by id',
                tags: ['api', 'surveys'],
                pre: [
                    fetchSurvey
                ],
                validate: inputValidations.SurveyParamsValidations,
                response: outputValidations.SurveyOnGetOutputValidationsConfig
            },
            handler: handlers.getSurveybyID
        }
    ]
}