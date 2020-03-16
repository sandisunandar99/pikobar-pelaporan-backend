const replyHelper = require('../helpers')

module.exports = (server) => {
    function constructSurveyResponse(survey, request) {   
        let jsonSurvey ={}
        if (request.method === 'post'){
            jsonSurvey = {
                status: 201,
                message: "Survey berhasil di buat",
                data: survey.surveys
            }
        }else if (request.method === 'put'){
            jsonSurvey = {
                status: 201,
                message: 'Survei berhasil di perbaharui',
                data: survey.surveys
            }
        }else if (request.method === 'delete') {
            jsonSurvey = {
                status: 200,
                message: 'Survei berhasil di hapus',
                data: null
            }
        }else{
            jsonSurvey = {
                status: 200,
                message: "Berhasil",
                data: survey.surveys,
                _metaData : survey._meta
            }
        }
        // return survey
        return jsonSurvey
    }


    return{

        /**
         * GET /api/surveys
         * @param {*} request 
         * @param {*} reply 
         */
        async getListSurvey(request, reply){
            let user = request.auth.isAuthenticated ? request.auth.credentials.user : null
            let query = request.query
    
            server.methods.services.surveys.getListSurvey(user, query, (err, survey) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(constructSurveyResponse(survey, request))
            })
        },

        /**
         * POST /api/surveys
         * @param {*} request
         * @param {*} reply 
         */
        async createSurvey(request, reply){
            server.methods.services.surveys.createSurvey(
            request.auth.credentials.user,
            request.payload,
            (err, survey) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructSurveyResponse({surveys: survey.toJSONFor(request.auth.credentials.user)}, request)
                ).code(201)
            })       
        },

        /**
        * DELETE /api/surveys/{id}
        * @param {*} request
        * @param {*} reply
        */
        async deleteSurvey(request, reply){
            server.methods.services.surveys.deleteSurvey(
                request.pre.surveys,
                (err, survey) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(constructSurveyResponse(survey, request)).code(200)
            })
        },

        /**
       * PUT /api/surveys/{id}
       * @param {*} request
       * @param {*} reply
       */
        async updateSurvey(request, reply) {   
            server.methods.services.surveys.udpateSurvey(
                request.pre.surveys,
                request.payload,
                (err, survey) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructSurveyResponse({surveys: survey.toJSONFor(request.auth.credentials.user)}, request)
                    )
                })
        },

        /**
       * PUT /api/surveys/{id}
       * @param {*} request
       * @param {*} reply
       */
        async softDeleteSurvey(request, reply) {
            server.methods.services.surveys.softDeleteSurveybyID(
                request.pre.surveys,
                request.payload,
                (err, survey) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructSurveyResponse({surveys: survey.toJSONFor(request.auth.credentials.user)}, request)
                    )
                })
        },

        /**
        * GET /api/surveys/{id}
        * @param {*} request
        * @param {*} reply
        */
        async getSurveybyID(request, reply){
            let surveys = request.pre.surveys.toJSONFor(null)
            if (request.auth.isAuthenticated) {
                surveys = request.pre.surveys.toJSONFor(request.auth.credentials.user)
            }
            return reply(constructSurveyResponse({surveys}, request))
        },
      
        /**
        * GET /api/surveys/{id}/quetions
        * @param {*} request
        * @param {*} reply
        */
        async createQustion(request, reply){
            server.methods.services.questions.createQuestion(
                request.payload,
                request.pre.surveys,
                (err, survey) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructSurveyResponse({ surveys: survey.toJSONFor(request.auth.credentials.user) }, request)
                    ).code(201)
            }) 
        }
    }
}