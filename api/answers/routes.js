module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    const inputValidations = require('./validations/input')
    const outputValidations = require('./validations/output') 
    const fetchSurveyIdByUrlEncrypt = require('./route_prerequesites').fetchSurveyIdByUrlEncrypt(server)  
    const fetchSurveyById = require('./route_prerequesites').fetchSurveyById(server)  
    const fetchAnswerBySurveyId = require('./route_prerequesites').fetchAnswerBySurveyId(server)  
    const countAnswer = require('./route_prerequesites').countAnswer(server)  

    return [
        {
            method: 'POST',
            path: '/answers/{url}',
            config: {
                description: 'Save result answer survey',
                tags: ['api', 'survey', 'answer'],
                pre: [
                    fetchSurveyIdByUrlEncrypt
                ]
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.saveAnswerSurvey
        },
        {
            method: 'GET',
            path: '/answers/{id}/infosurvey',
            config: {
                auth: 'jwt',
                description: 'info survey for show list respondent',
                tags: ['api', 'survey', 'answer'],
                pre: [
                    countAnswer,
                    fetchSurveyById
                ]
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.showInfoSurvey
        },
        {
            method: 'GET',
            path: '/answers/{id}',
            config: {
                auth: 'jwt',
                description: 'List respondent after save question',
                tags: ['api', 'survey', 'answer'],
                pre: [
                    fetchAnswerBySurveyId
                ]
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.listAnswerRespondent
        }
    ]

}