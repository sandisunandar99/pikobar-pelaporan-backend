const replyHelper = require('../helpers')


const validationBeforeInput = server => {
    return {
        method: (request, reply) => {
            if (request.payload.address_district_code === request.auth.credentials.user.code_district_city) {
                return reply(request.auth.credentials.user.code_district_city)
            } else {
                return reply({
                    status: 403,
                    message: 'Anda tidak dapat melakukan input kasus di luar wilayah anda.!',
                    data: null
                }).code(403).takeover()
            } 
        },
        assign: 'validation_before_input'
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

            const payload = await helper.caseSheetExtraction(request)

            const rules = require('./validations/input')

            const Joi = require('joi')

            const { label } = require('../../helpers/casesheet/casesheetconfig.json')

            const caseSheetValidator = require('../../helpers/casesheet/casesheetvalidation')

            const errors = await caseSheetValidator.validate(payload, Joi, rules, label, helper, Case)

            if (Object.entries(errors).length) {
                let response ={
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

module.exports ={
    countCaseByDistrict,
    getCasebyId,
    checkIfDataNotNull,
    DataSheetRequest,
    validationBeforeInput
}
