const replyHelper = require('../helpers')
const urlCrypt = require('url-crypt')(process.env.URL_TOKEN_RESPONDENT)


const fetchSurveyIdByUrlEncrypt = server => {
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

                    if (!survey) {
                        return reply({
                            status: 404,
                            message: 'Survei tidak ditemukan.',
                            data: null
                        }).code(404).takeover()
                    }
                    return reply(survey)
                })
        },
        assign: 'survey_id'
    }
}


const fetchSurveyById= server => {
    return {
        method: (request, reply) => {
            if (!request.params.id) {
                return reply.continue()
            }

            server.methods.services.answers.getSurveyById(
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


const fetchAnswerBySurveyId = server => {
    return {
        method: (request, reply) => {
            if (!request.params.id) {
                return reply.continue()
            }

            server.methods.services.answers.getAnswerBySurveyId(
                request.params.id,
                request.query,
                (err, answer) => {
                    
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).takeover()
                    }
                    if (!answer) {
                        return reply({
                            status: 404,
                            message: 'Tidak ada tanggapan untuk survey ini.',
                            data: null
                        }).code(404).takeover()
                    }
                    return reply(answer)
                })
        },
        assign: 'answers'
    }
}


const countAnswer = server =>{
    return {
        method: (request, reply) => {
            if (!request.params.id) {
                return reply.continue()
            }  

            server.methods.services.answers.countAnswerSurvey(
                request.params.id,
                (err, count) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).takeover()
                    }

                    if (!count) {
                        return reply({
                            status: 404,
                            message: 'Tidak ada tanggapan untuk survey ini.',
                            data: null
                        }).code(404).takeover()
                    }
                    return reply(count)
                })
        },
        assign: 'count_answers'
    }
}

module.exports ={
    fetchSurveyIdByUrlEncrypt,
    fetchSurveyById,
    fetchAnswerBySurveyId,
    countAnswer
}