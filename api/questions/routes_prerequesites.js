const replyHelper = require('../helpers')
const urlCrypt = require('url-crypt')(process.env.URL_TOKEN_RESPONDENT)


const fetchSurveyQuestion = server => {
    return {
        method: (request, reply) => { 
            if (!request.params.id) {
                return reply.continue()
            }

            server.methods.services.questions.getSurveyById(
                request.params.id,
                request.auth.credentials.user,
                (err, survey) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).takeover()
                    }

                    if (survey.status === 'Deleted') {
                        return reply({
                            status: 403,
                            message: 'Survei telah dihapus.',
                            data: null
                        }).code(403).takeover()
                    } else {
                        if (!survey) {
                            return reply({
                                status: 404,
                                message: 'Survei tidak ditemukan.',
                                data: null
                            }).code(404).takeover()
                        }
                        return reply(survey)
                    }
                })
        },
        assign: 'surveys'
    }
}


const fetchQuestionBySurveyId = server => {
    return {
        method: (request, reply) =>{
            if (!request.params.id) {
                return reply.continue()
            }
            server.methods.services.questions.getQuestionBySurveyId(
                request.query,
                request.params.id,
                request.auth.credentials.user,
                (err, question) =>{
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).takeover()
                    }

                    if (!question) {
                        return reply({
                            status: 404,
                            message: 'Pertanyaan untuk survei ini tidak ditemukan.',
                            data: null
                        }).code(404).takeover()
                    }
                    return reply(question)
            })
            
        },
        assign: 'questions'
    }
}


const authorizeSurvey = server => {
    return {
        method: (request, reply) => {
            if (request.pre.surveys === 'undefined') {
                return reply.continue()
            }

            if (request.auth.credentials.user._id.toString() !== request.pre.surveys.author._id.toString()) {
                return reply({
                    status: 403,
                    message: 'Anda tidak bisa menghapus question ini!',
                    data: null
                }).code(403).takeover()
            }

            return reply(true)
        },
        assign: 'authorized'
    }
}


const checkQuestionBeforeSave = server => {
    return{
        method: (request, reply) =>{
            if (request.pre.surveys === 'undefined') {
                return reply.continue()
            }

            let user = request.auth.credentials.user
            let survey = request.pre.surveys.JSONForSurveyQuestion(user, params = null)
            
            server.methods.services.questions.beforeSaveQustion(
                user,
                survey,
                (err, survey) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).takeover()
                    }

                    if (survey.msg ==='deleted') {
                        return reply({ deleted: true })
                    }else{
                        return reply({ deleted: false}).code(500).takeover()
                    }    
                }
            )
            
            
        },
        assign: 'beforeSave'
    }
}

const fetchSurveyQuestionByUrlEncrypt = server => {
    return {
        method: (request, reply) => {
            if (!request.params.url) {
                return reply.continue()
            }

            let getPayload

            try {
                getPayload = urlCrypt.decryptObj(request.params.url)
            } catch (e) {
                return reply({
                    status: 400,
                    message: 'Mohon cek kembali URL survei anda!',
                    data: null
                }).code(400).takeover()
            }

            server.methods.services.questions.getSurveyByUrl(
                getPayload.id,
                (err, survey) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).takeover()
                    }

                    if (survey.status === 'Deleted') {
                        return reply({
                            status: 403,
                            message: 'Survei telah dihapus.',
                            data: null
                        }).code(403).takeover()
                    } else {
                        if (!survey) {
                            return reply({
                                status: 404,
                                message: 'Survei tidak ditemukan.',
                                data: null
                            }).code(404).takeover()
                        }
                        return reply(survey)
                    }
                })
        },
        assign: 'public_surveys'
    }
}

const fetchQuestionByUrlEncrypt = server => {
    return {
        method: (request, reply) => {
            if (!request.params.url) {
                return reply.continue()
            }

            let getPayload

            try {
                getPayload = urlCrypt.decryptObj(request.params.url)
            } catch (e) {
                return reply({
                    status: 400,
                    message: 'Mohon cek kembali URL survei anda!',
                    data: null
                }).code(400).takeover()
            }

            server.methods.services.questions.getQuestionSurveyByUrl(
                request.query,
                getPayload.id,
                (err, question) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).takeover()
                    }

                    if (!question) {
                        return reply({
                            status: 404,
                            message: 'Pertanyaan untuk survei ini tidak ditemukan.',
                            data: null
                        }).code(404).takeover()
                    }
  
                    return reply(question)
            })

        },
        assign: 'public_questions'
    }
}


module.exports = {
    fetchSurveyQuestion,
    authorizeSurvey,
    fetchQuestionBySurveyId,
    checkQuestionBeforeSave,
    fetchQuestionByUrlEncrypt,
    fetchSurveyQuestionByUrlEncrypt
}
