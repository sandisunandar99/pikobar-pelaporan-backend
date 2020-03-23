const replyHelper = require('../helpers')


const CheckRoleView = server =>{
    return {
        method: (request, reply) =>{

            if (   request.auth.credentials.user.role === "dinkesprov" 
                || request.auth.credentials.user.role === "dinkeskota") {
                return reply()
            }else{
                return reply({
                    status: 403,
                    message: 'Anda Tidak Mempunyai Akses!',
                    data: null
                }).code(403).takeover()
            }
           
        },
        assign: 'roles'
    }
}


const CheckRoleCreate = server => {
    return {
        method: (request, reply) => {

            if (request.auth.credentials.user.role === "dinkeskota") {
                return reply()
            } else {
                return reply({
                    status: 403,
                    message: 'Anda Tidak Mempunyai Akses!',
                    data: null
                }).code(403).takeover()
            }

        },
        assign: 'roles'
    }
}

const CheckRoleUpdate = server => {
    return {
        method: (request, reply) => {

            if (request.auth.credentials.user.role === "dinkeskota") {
                return reply()
            } else {
                return reply({
                    status: 403,
                    message: 'Anda Tidak Mempunyai Akses!',
                    data: null
                }).code(403).takeover()
            }

        },
        assign: 'roles'
    }
}

const CheckRoleDelete = server => {
    return {
        method: (request, reply) => {
            if (request.auth.credentials.user.role === "dinkeskota") {
                return reply()
            } else {
                return reply({
                    status: 403,
                    message: 'Anda Tidak Mempunyai Akses!',
                    data: null
                }).code(403).takeover()
            }

        },
        assign: 'roles'
    }
}

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
    CheckRoleView,
    CheckRoleCreate,
    CheckRoleUpdate,
    CheckRoleDelete,
    countCaseByDistrict,
    getCasebyId
}
