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
            const helper = require("../../helpers/casesheet/casesheetextraction")

            const payload = await helper.caseSheetExtraction(request)

            const validations = require('./validations/input')

            const Joi = require('joi')

            let objError = {}
            let strErrors = ''

            for (let i in payload) {
              let propErr = {}
              let errors = []

              const result = Joi.validate(payload[i], validations.caseSchemaValidation)
            
              if (result.error!==null) {
                strErrors += '[row_' + (parseInt(i)+1).toString() + ']'
                for (e in result.error.details) {
                    let messg = result.error.details[e].message
                    let prop = messg.substr(1, messg.lastIndexOf('"')-1)
                    strErrors += messg + ', '

                    if (!Array.isArray(propErr[prop])) {
                        propErr[prop] = []
                    }
                    propErr[prop].push(messg)
                }   
              }

              // is address_district_code exist?
              const code = payload[i].address_district_code
              const isDistrictCodeValid = await helper.isDistrictCodeValid(code)
              
              if (!isDistrictCodeValid) {
                let prop = 'address_district_code'
                let messg = 'Invalid address_district_code '
                if (!Array.isArray(propErr[prop])) {
                    propErr[prop] = []
                }
                propErr[prop].push(messg)
                strErrors += messg
              }

              strErrors += '\n'
              if (Object.keys(propErr).length !== 0) {
                errors.push(propErr)
              }

              if (errors.length) {
                objError['row_' + (parseInt(i)+1).toString()] = errors
              }
            }
            
            if (Object.entries(objError).length) {
                let response ={
                    status: 400,
                    message: strErrors,
                    errors: objError
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
