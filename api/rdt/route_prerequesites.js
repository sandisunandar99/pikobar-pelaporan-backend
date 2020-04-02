const replyHelper = require('../helpers')


const countRdtCode = server =>{
    return {
        method: (request, reply) => {
            server.methods.services.rdt.getCountRdtCode(
                request.payload.address_district_code,
                (err, count) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).takeover()
                    }
                    return reply(count)
                })
        },
        assign: 'count_rdt'
    }
}

const countCaseByDistrict = server => {
    return {
        method: (request, reply) => {
            server.methods.services.cases.getCountByDistrict(
                request.payload.address_district_code,
                (err, count) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).takeover()
                    }
                    return reply(count)
                })
        },
        assign: 'count_case'
    }
}

const getRdtbyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.id
             server.methods.services.rdt.getById(id, (err, item) => {
                 if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                 return reply(item)
             })
        },
        assign: 'rdt'
    }
}


const getCodeDinkes = server => {
    return {
        method: (request, reply) => {
             let code = request.payload.address_district_code
             server.methods.services.rdt.getCodeDinkes(code, (err, item) => {
                 if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                  return reply(item)
             })
        },
        assign: 'code_dinkes'
    }
}


const checkIfDataNotNull = server => {
    return {
        method: (request, reply) => {
            let query = request.query
            let user = request.auth.credentials.user
            let fullname = user.fullname

            server.methods.services.rdt.list(
                query,
                user,
                (err, result) => {
                    if (result.rdt.length === 0) {
                        return reply({
                            status: 400,
                            message: 'Data untuk ' + fullname + ' belum ada.',
                            data: null
                        }).code(400).takeover()
                    } else {
                        return reply()
                    }
                })
        },
        assign: 'check_rdt'
    }
}


module.exports ={
    countRdtCode,
    getRdtbyId,
    getCodeDinkes,
    countCaseByDistrict,
    checkIfDataNotNull
}
