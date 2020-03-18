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

const countCaseByDistrict = server =>{
    return {
        method: (request, reply) => {
            server.methods.services.cases.getCountByDistrict(
                request.auth.credentials.user.code_district_city,
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



module.exports ={
    CheckRoleView,
    CheckRoleCreate,
    CheckRoleUpdate,
    countCaseByDistrict
}
