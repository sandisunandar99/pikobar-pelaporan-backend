const replyHelper = require('../helpers')


const countCaseByDistrict = server =>{
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


const getCasebyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.id
             server.methods.services.cases.getById(id, (err, item) => {
                 if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                 return reply(item)
             })
        },
        assign: 'cases'
    }
}


const checkIfDataNotNull = server =>{
     return {
         method: (request, reply) => {
            let query = request.query
            let user = request.auth.credentials.user
            let fullname = user.fullname

             server.methods.services.cases.list(
                 query,
                 user,
                 (err, result) => {
                     if (result.cases.length === 0) {
                         return reply({
                             status: 400,
                             message: 'Data untuk '+fullname+' belum ada.',
                             data: null
                         }).code(400).takeover()
                     }else{
                         return reply()
                     }
                 })
         },
         assign: 'check_cases'
     }
}

module.exports ={
    countCaseByDistrict,
    getCasebyId,
    checkIfDataNotNull
}
