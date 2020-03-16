const replyHelper = require('../helpers')

module.exports = (server) => {
    function constructAnswerResponse(answer, request) {
        let jsonAnswer = {}
        if (request.method === 'post') {
            jsonAnswer = {
                status: 201,
                message: "Jawaban survey berhasil disimpan",
                data: answer.answers
            }
        } else {
            jsonAnswer = {
                status: 200,
                message: "Berhasil",
                data: answer
            }
        }
        // return survey
        return jsonAnswer
    }


    return {
        /**
         * GET /api/surveys/{id}/quetions
         * @param {*} request
         * @param {*} reply
         */
        async saveAnswerSurvey(request, reply){
            let survey = request.pre.survey_id 

            server.methods.services.answers.saveSurveyRespond(
                request.payload,
                survey,
                (err, answer) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    
                    return reply(
                        constructAnswerResponse({ answers: answer.toJSONFor()}, request)
                    ).code(201)
                }
            )
        }, 


        /**
         * GET /api/surveys/{id}/quetions
         * @param {*} request
         * @param {*} reply
         */
        async showInfoSurvey(request, reply){
            let user = request.auth.isAuthenticated ? request.auth.credentials.user : null    
            let survey = request.auth.isAuthenticated ? request.pre.surveys : null
            let surveys = request.pre.surveys.JSONForSurveyAnswer(user, survey)
            return reply(constructAnswerResponse({ surveys }, request))
        },

        async listAnswerRespondent(request, reply) {
            return reply(constructAnswerResponse(request.pre.answers, request))
        }
    }

}