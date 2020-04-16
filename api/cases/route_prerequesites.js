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
            const helper = require("../../helpers/casesheetextraction")

            const payload = await helper.caseSheetExtraction(request)

            var Joi = require('joi')
            const schema = Joi.object().keys({
                name: Joi.string().min(3).required(),
                address_village_name: Joi.string().min(3).required(),
                address_subdistrict_name: Joi.string().min(3).required(),
                address_district_name: Joi.string().min(3).required()
            }).unknown()

            let objError = {}

            for (let i in payload) {
              let errors = []

              const result = Joi.validate(payload[i], schema)
              if (result.error!==null) {
                errors.push(result.error.details[0].message)
              }

              // is address_district_code exist?
              const code = payload[i].address_district_code
              const isDistrictCodeValid = await helper.isDistrictCodeValid(code)
              
              if (!isDistrictCodeValid) {
                errors.push('Invalid address_district_code')
              }

              if (errors.length) {
                objError[parseInt(i)+1] = errors
              }
            }
            
            if (Object.entries(objError).length) {
                let response ={
                    status: 400,
                    message: "Bad request",
                    error: objError
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
    DataSheetRequest
}
