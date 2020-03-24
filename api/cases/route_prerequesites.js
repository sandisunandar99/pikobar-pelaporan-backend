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


module.exports ={
    countCaseByDistrict,
    getCasebyId
}
