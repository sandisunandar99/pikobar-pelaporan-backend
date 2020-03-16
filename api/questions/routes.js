module.exports = (server) =>{
    const handlers = require('./handlers')(server)    
    const inputValidations = require('./validations/input')
    const outputValidations = require('./validations/output')
    const fetchSurveyQuestion = require('./routes_prerequesites').fetchSurveyQuestion(server)
    const fetchQuestionBySurveyId = require('./routes_prerequesites').fetchQuestionBySurveyId(server)
    const checkQuestionBeforeSave = require('./routes_prerequesites').checkQuestionBeforeSave(server)
    const fetchQuestionByUrlEncrypt = require('./routes_prerequesites').fetchQuestionByUrlEncrypt(server)
    const fetchSurveyQuestionByUrlEncrypt = require('./routes_prerequesites').fetchSurveyQuestionByUrlEncrypt(server)
    const authorizeSurvey = require('./routes_prerequesites').authorizeSurvey(server)

    return [
        {
            method: 'POST',
            path: '/surveys/{id}/questions',
            config:{
                auth: 'jwt',
                description: 'Create quetion for survey',
                tags: ['api', 'surveys', 'questions'],
                pre:[
                    fetchSurveyQuestion,
                    checkQuestionBeforeSave
                ]
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.createQuestion
        },
        {
            method: 'GET',
            path: '/surveys/{id}/questions',
            config: {
                auth: 'jwt',
                description: 'get quetion by survey id',
                tags: ['api', 'surveys', 'questions'],
                pre: [
                    fetchSurveyQuestion,
                    fetchQuestionBySurveyId
                ]
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.getQuestion
        },
        {
            method: 'GET',
            path: '/surveys/{url}/form',
            config: {
                description: 'get question survey for public consumption',
                tags: ['api', 'surveys', 'questions'],
                pre: [
                    fetchSurveyQuestionByUrlEncrypt,
                    fetchQuestionByUrlEncrypt   
                ]
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.getQuestionByUrl
        },
    ]
}