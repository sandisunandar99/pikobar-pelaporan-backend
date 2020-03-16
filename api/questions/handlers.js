const replyHelper = require('../helpers')

module.exports = (server) => {
    function constructQuestionResponse(question, request) {   
        let jsonQuestion ={}
        if (request.method === 'post'){
            jsonQuestion = {
                status: 201,
                message: "Pertanyaan berhasil di buat",
                data: question
            }
        }else if (request.method === 'put'){
            jsonQuestion = {
                status: 201,
                message: 'Pertanyaan berhasil di perbaharui',
                data: question.questions
            }
        }else if (request.method === 'delete') {
            jsonQuestion = {
                status: 200,
                message: 'Pertanyaan berhasil di hapus',
                data: null
            }
        }else{
            jsonQuestion = {
                status: 200,
                message: "Berhasil",
                data: {
                    surveys: question.surveys,
                    questions: question.questions
                }
            }
        }
        // return survey
        return jsonQuestion
    }
   
    return{

        /**
        * GET /api/surveys/{id}/quetions
        * @param {*} request
        * @param {*} reply
        */
        async createQuestion(request, reply){
            server.methods.services.questions.createQuestion(
                request.payload,
                request.pre.surveys,
                request.pre.beforeSave,
                (err, question) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructQuestionResponse(question, request)
                    ).code(201)
            }) 
        }, 

        /**
        * GET /api/surveys/{id}/quetions
        * @param {*} request
        * @param {*} reply
        */
        async getQuestion(request, reply){
            let user = request.auth.isAuthenticated ? request.auth.credentials.user : null
            let questions 
            let survey = request.auth.isAuthenticated ? request.pre.surveys : null
            let surveys = request.pre.surveys.JSONForSurveyQuestion(user, survey)

            if (request.auth.isAuthenticated){
                surveys = request.pre.surveys.JSONForSurveyQuestion(user, survey)
                questions = request.pre.questions
            }
            return reply(constructQuestionResponse({ surveys, questions}, request))
        },

        /**
        * GET /api/surveys/{id}/quetions
        * @param {*} request
        * @param {*} reply
        */
        async getQuestionByUrl(request, reply) { 
            
            let questions = request.pre.public_questions
            let surveys = request.pre.public_surveys.JSONForSurveyQuestionPublic()

            return reply(constructQuestionResponse({ surveys, questions}, request))
        }

    }
}