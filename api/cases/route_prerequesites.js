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
            const fs = require('fs')
            const readXlsxFile = require('read-excel-file/node')
            const dir = './upload/'
          
          
            const handleFileUpload = file => {
              return new Promise((resolve, reject) => {
                var filename = new Date().getTime() + '_' + file.hapi.filename.replace(' ', '')
                const data = file._data

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir)
                }
          
                fs.writeFile(dir + filename, data, err => {
                  if (err) {
                    return callback(err, null)
                  }
                  resolve({ filename: filename })
                })
              })
            }
          
            const uploaded = await handleFileUpload(request.payload.file)
          
            let dataSheet = await readXlsxFile(dir + uploaded.filename)

            dataSheet.splice(0,6)
          
            let payload = []
            
            for (i in dataSheet)
            {
              if (dataSheet[i][0] === null) continue 
              
              let dt = dataSheet[i]

              let obj = {
                id_case_national: dt[0],
                id_case_related: dt[1],
                name: dt[3],
                birth_date: dt[4],
                age: dt[5],
                gender: dt[6] == 'laki-laki' ? 'L' : 'P',
                phone_number: dt[12],
                address_street: dt[7],
                address_district_code: '32.73', //todo find
                address_district_name: dt[10],
                address_subdistrict_code: '32.73.02', //todo find
                address_subdistrict_name: dt[9],
                address_village_code: '32.73.02.01',
                address_village_name: dt[8],
                nationality: dt[13],
                nationality_name: dt[14],
                occupation: dt[15],
                office_address: null,
                
                status: dt[19],
                stage: dt[20],
                diagnosis: dt[16],
                final_result: dt[21],
                last_changed: '2020-03-17 12:44', //todo
                is_went_abroad: false, //todo
                visited_country: '', //todo
                return_date: null, //todo
                is_went_other_city: false, //todo
                visited_city: null, //todo
                is_contact_with_positive: false, //todo
                history_notes: null, //todo 
                
                report_source: null, //todo
                first_symptom_date: null, //todo
                
                is_sample_taken: dt[22] == 'ya' ? true : false, //todo
                current_location_type: dt[23] != null ? 'RS' : 'RUMAH',
                current_hospital_id: dt[23] != null ? '5e75c8613470d48dbd6f5b06' : 'RUMAH', //todocheck
                current_location_address: dt[23],
                other_notes: null,
              }
          
              payload.push(obj)
            }

            var Joi = require('joi')
            const schema = Joi.object().keys({
                name: Joi.string().min(3).required(),
                address_village_name: Joi.string().min(3).required(),
                address_subdistrict_name: Joi.string().min(3).required(),
                address_district_name: Joi.string().min(3).required()
            }).unknown()

            let error = {}
            let errors = []

            for (let i in payload) {
                const result = Joi.validate(payload[i], schema)
                if (result.error!==null) {
                    error[parseInt(i)+1] = result.error.details[0].message
                    errors.push(error)
                }
            }
            
            if (errors.length > 0) {
                let response ={
                    status: 400,
                    message: "Bad request",
                    error: errors
                }
                return reply(response).code(400).takeover()
            }

            fs.unlink(dir + uploaded.filename, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
            })

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
