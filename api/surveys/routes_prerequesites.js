const replyHelper = require('../helpers')

const fetchSurvey = server => {
    return {
        method: (request, reply) => { 
            if (!request.params.id) {
                return reply.continue()
            }

            server.methods.services.surveys.getbyIDSurvey(
                request.params.id,
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
                    }else{
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


const authorizeSurvey = server => {
    return {
        method: (request, reply) => {
            if (request.pre.surveys === 'undefined') {
                return reply.continue()
            }

            if (request.auth.credentials.user._id.toString() !== request.pre.surveys.author._id.toString()) {
                return reply({
                    status: 403,
                    message: 'Anda tidak bisa menghapus survei ini!',
                    data: null
                }).code(403).takeover()
            }

            return reply(true)
        },
        assign: 'authorized'
    }
}


module.exports = {
    fetchSurvey,
    authorizeSurvey
}
