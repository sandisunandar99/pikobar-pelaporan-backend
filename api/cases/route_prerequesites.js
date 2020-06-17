const replyHelper = require('../helpers')

const validationBeforeInput = server => {
    return {
        method: (request, reply) => {
            if (request.payload.address_district_code === request.auth.credentials.user.code_district_city) {
                return reply(request.auth.credentials.user.code_district_city)
            } else {
                return reply({
                    status: 422,
                    message: 'Anda tidak dapat melakukan input kasus di luar wilayah anda.!',
                    data: null
                }).code(422).takeover()
            } 
        },
        assign: 'validation_before_input'
    }
}

const CheckCredentialUnitIsExist = server => {
    return {
        method: (request, reply) => {
            let user = request.auth.credentials.user
            if (user.unit_id) {
                return reply()
            } else {
                return reply({
                    status: 422,
                    message: 'Anda tidak memiliki akses unit, silahkah edit profil user unit!',
                    data: null
                }).code(422).takeover()
            }
        },
        assign: 'check_credential_unit_is_exist'
    }
}

const checkCaseIsExists = server => {
    return {
        method: (request, reply) => {
            const nik = request.payload.nik
            if(!nik) return reply()
            server.methods.services.cases.getByNik(nik, (err, result) => {
                if (!result) return reply(result)

                let author = result.author ? result.author.fullname : null

                let message
                message = `NIK ${nik} atas nama ${result.name} `

                if (result.transfer_to_unit_name && result.transfer_status !== 'approved' ) {
                    message += `Sedang dalam proses rujukan ke ${result.transfer_to_unit_name}`
                } else if (result.transfer_to_unit_name && result.transfer_status === 'approved') {
                    message += `Sudah terdata di laporan kasus ${result.transfer_to_unit_name}`
                } else {
                    message += `Sudah terdata di laporan kasus ${author}`
                }

                return reply({
                    status: 422,
                    message: message,
                    data: null
                }).code(422).takeover()
            })
       },
       assign: 'case_exist'
    }
}

const countCaseByDistrict = server =>{
    return {
        method: (request, reply) => {
            if (request.route.method === 'put' && request.route.path === '/api/cases/{id}') {
                if (!request.payload.address_district_code)
                    return reply()
            }

            server.methods.services.cases.getCountByDistrict(
                request.payload.address_district_code,
                (err, count) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
                    }
                    return reply(count)
                })
        },
        assign: 'count_case'
    }
}

const countCasePendingByDistrict = server =>{
    return {
        method: (request, reply) => {
            if (request.route.method === 'put' && request.route.path === '/api/cases/{id}') {
                if (!request.payload.address_district_code)
                    return reply()
            }

            server.methods.services.cases.getCountPendingByDistrict(
                request.payload.address_district_code,
                (err, count) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
                    }
                    return reply(count)
                })
        },
        assign: 'count_case_pending'
    }
}


const getCasebyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.id
             server.methods.services.cases.getById(id, (err, item) => {
                 if (err) return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
                 return reply(item)
             })
        },
        assign: 'cases'
    }
}

const checkCaseIsAllowToDelete = server => {
    return {
        method: (request, reply) => {
            let user = request.auth.credentials.user
            let currentCase = request.preResponses.cases.source
            if (user.role === 'faskes' && currentCase.verified_status === 'verified') {
                return reply({
                    status: 422,
                    message: 'Data terverifikasi tidak dapat dihapus!',
                    data: null
                }).code(422).takeover()
             }
            return reply(true)
        },
        assign: 'is_delete_allow'
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
                     if(result !== null){
                        if (result.cases.length === 0) {
                            return reply({
                                status: 200,
                                message: 'Data untuk '+fullname+' belum ada.',
                                data: null
                            }).code(200).takeover()
                        }else{
                            return reply()
                        }
                     }else{
                        return reply({
                            status: 200,
                            message: 'Data untuk '+fullname+' belum ada.',
                            data: null
                        }).code(200).takeover()
                     }
                 })
         },
         assign: 'check_cases'
     }
}

const DataSheetRequest = server => {
    return {
        method: async (request, reply) => {
            
            const mongoose = require('mongoose');

            require('../../models/Case');
            const Case = mongoose.model('Case');
            
            const helper = require("../../helpers/casesheet/casesheetextraction")

            const rules = require('./validations/input')

            const Joi = require('joi')

            const config = require('../../helpers/casesheet/casesheetconfig.json')

            const caseSheetValidator = require('../../helpers/casesheet/casesheetvalidation')

            const payload = await helper.caseSheetExtraction(request)

            let invalidPaylodMessage = null

            if (payload === config.unverified_template) {
                invalidPaylodMessage = config.messages.unverified_template
            } else if (payload === config.version_out_of_date) {
                invalidPaylodMessage = config.messages.version_out_of_date
            }else if (payload.length > config.max_rows_allowed) {
                invalidPaylodMessage = `Maksimal import kasus adalah ${config.max_rows_allowed} baris`
            }

            if (invalidPaylodMessage) {
                let response = {
                    status: 400,
                    message: 'Bad request.',
                    errors:  invalidPaylodMessage.split()
                }
                return reply(response).code(400).takeover()
            }

            const errors = await caseSheetValidator.validate(payload, Joi, rules, config, helper, Case)

            if (errors.length) {
                let response = {
                    status: 400,
                    message: 'Bad request.',
                    errors: errors
                }
                return reply(response).code(400).takeover()
            }

            return reply(payload)
        },
        assign: 'data_sheet'
    }
}

const getDetailCase = server => {
    return {
        method: (request, reply) => {
            const id = request.params.id
            server.methods.services.cases.getById(id, async (err, result) => { 
                if (err) {
                    return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
                }

                if (result.verified_status === 'verified') {
                    return reply({
                        status: 422,
                        message: 'Case already verified!',
                        data: null
                    }).code(422).takeover()
                }
                
                server.methods.services.cases.getCountByDistrict(
                    result.address_district_code,
                    async (err, count) => {
                        if (err) {
                            return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
                        }

                        return reply(count)
                    })
            })
        },
        assign: 'count_case'
    }
}

const getTransferCasebyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.transferId
             server.methods.services.casesTransfers.getById(id, (err, item) => {
                 if (err) return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
                 return reply(item)
             })
        },
        assign: 'transfer_case'
    }
}

const CheckCaseIsAllowToTransfer = server => {
    return {
        method: (request, reply) => {
            const params = {
                transfer_case_id: request.params.id,
            }

            let currentCase = request.preResponses.cases.source
            if (currentCase.verified_status !== 'verified') {
                return reply({
                    status: 422,
                    message: 'Data Kasus belum terverifikasi oleh Dinkes!',
                    data: null
                }).code(422).takeover()
             }

            server.methods.services.casesTransfers.getLastTransferCase(params, (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()

                if (!result || !['pending', 'declined'].includes(result.transfer_status)) return reply(result)                

                const msg = "Rujukan sudah ada dan sedang menunggu persetujuan dari " + result.transfer_to_unit_name
                return reply({
                    status: 422,
                    message: msg,
                    data: null
                }).code(422).takeover()
            })
        },
        assign: 'is_case_allow_to_transfer'
    }
}

const CheckIsTransferActionIsAllow = server => {
    return {
        method: (request, reply) => {
            let user = request.auth.credentials.user
            const params = {
                transfer_case_id: request.params.id,
            }
            server.methods.services.casesTransfers.getLastTransferCase(params, (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
                
                let action = 'aborted'
                if (request.params.action === 'approve') action = 'approved'
                else if (request.params.action === 'decline') action = 'declined'

                let msg = request.params.action + ' is already in process!'
                if (result.transfer_status === 'approved') {
                    msg =  'Case is already approved!'
                } else if (result && action === result.transfer_status) {
                    msg = request.params.action + ' is already in process!'               
                } else if (request.params.action === 'approve') {
                    if (result.transfer_to_unit_id.toString() !== user.unit_id._id.toString()) {
                        msg =  'Only the destination unit is allowed to approve!'
                    } else if (result.transfer_status !== 'pending') {
                        msg =  'Only pending transfer cases are allow to approve!'
                    } else {
                        return reply(result)
                    }
                } else if (request.params.action === 'decline') {
                    if (result.transfer_to_unit_id.toString() !== user.unit_id._id.toString()) {
                        msg =  'Only the destination unit is allowed to decline!'
                    } else if (result.transfer_status !== 'pending') {
                        msg =  'Only pending transfer cases are allow to decline!'
                    } else {
                        return reply(result)
                    }
                } else if (request.params.action === 'abort') {
                    if (result.transfer_from_unit_id.toString() !== user.unit_id._id.toString()) {
                        msg =  'Only the transfer creator is allowed to abort!'
                    } else {
                        return reply(result)
                    }
                }
                
                return reply({
                    status: 422,
                    message: msg,
                    data: null
                }).code(422).takeover()
            })
        },
        assign: 'is_case_allow_to_action'
    }
}

module.exports ={
    countCaseByDistrict,
    countCasePendingByDistrict,
    getCasebyId,
    checkIfDataNotNull,
    DataSheetRequest,
    validationBeforeInput,
    checkCaseIsExists,
    getDetailCase,
    checkCaseIsAllowToDelete,
    getTransferCasebyId,
    CheckCaseIsAllowToTransfer,
    CheckIsTransferActionIsAllow,
    CheckCredentialUnitIsExist,
}
