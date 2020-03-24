const replyHelper = require('../helpers')


const CheckRoleView = server => {
    return {
        method: (request, reply) => {

            if (request.auth.credentials.user.role === "superadmin" ||
                request.auth.credentials.user.role === "dinkesprov" ||
                request.auth.credentials.user.role === "faskes" ||
                request.auth.credentials.user.role === "dinkeskota") {
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

const CheckRoleCreate = server => {
    return {
        method: (request, reply) => {

            if (request.auth.credentials.user.role === "superadmin" ||
                request.auth.credentials.user.role === "faskes" ||
                request.auth.credentials.user.role === "dinkeskota") {
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

            if (request.auth.credentials.user.role === "superadmin" ||
                request.auth.credentials.user.role === "dinkeskota") {
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
            if (request.auth.credentials.user.role === "superadmin" ||
                request.auth.credentials.user.role === "dinkeskota") {
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



module.exports = {
    CheckRoleView,
    CheckRoleCreate,
    CheckRoleUpdate,
    CheckRoleDelete
}
