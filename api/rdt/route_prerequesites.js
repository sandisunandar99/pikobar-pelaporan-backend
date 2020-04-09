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
            server.methods.services.rdt.getCountByDistrict(
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

const getCasebyIdcase = server =>{
     return {
         method: (request, reply) => {
             let idcase = request.pre.rdt.id_case
              server.methods.services.rdt.getCaseByidcase(idcase, (err, item) => {     
                 if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                 return reply(item)
             })
         },
         assign: 'cases'
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
                            status: 200,
                            message: 'Data untuk ' + fullname + ' belum ada.',
                            data: null
                        }).code(200).takeover()
                    } else {
                        return reply()
                    }
                })
        },
        assign: 'check_rdt'
    }
}

const getDataExternal = server => {
    return {
        method: (request, reply) => {
            server.methods.services.rdt.getDatafromExternal(
                request.query.address_district_code,
                request.query.search,
                (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(item)
            })
        },
        assign: 'data_pendaftaran'
    }
}

const searchIdcasefromExternal = server =>{
    return {
        method: (request, reply) => {
            server.methods.services.rdt.seacrhFromExternal(
                request.query.address_district_code,
                request.query.search,
                (err, item) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(item)
                })
        },
        assign: 'search_external'
    }
}

const searchIdcasefromInternal = server => {
    return {
        method: (request, reply) => {
            server.methods.services.rdt.seacrhFromInternal(
                request.query,
                (err, item) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(item)
                })
        },
        assign: 'search_internal'
    }
}


module.exports ={
    countRdtCode,
    getRdtbyId,
    getCasebyIdcase,
    getCodeDinkes,
    countCaseByDistrict,
    checkIfDataNotNull,
    getDataExternal,
    searchIdcasefromInternal,
    searchIdcasefromExternal
}
