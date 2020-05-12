const replyHelper = require('../helpers')
const request_module = require('request')

module.exports = (server) => {
    function constructLogisticsResponse(occupations) {
        let jsonOccupations = {
            status: 200,
            message: "Success",
            data: occupations
        }
        // return survey
        return jsonOccupations
    }

    return {
        /**
         * POST /api/logistic-request
         * @param {*} request
         * @param {*} reply
         */
        async RegisterLogisticsRequest(request, reply){
            let base_url = process.env.URL_API_LOGISTIC
            let payload = request.payload
            let user = request.auth.credentials.user

            payload['user_id'] = user._id.toString()
            // adjust attachment field to upload using multipart/form-data post scheme
            payload.letter_file = {
                value: payload.letter_file._data, 
                options: { 
                    filename: payload.letter_file.hapi.filename,
                    contentType: payload.letter_file.hapi.headers['content-type'],
                },
            }
            payload.applicant_file = {
                value: payload.applicant_file._data, 
                options: { 
                    filename: payload.applicant_file.hapi.filename,
                    contentType: payload.applicant_file.hapi.headers['content-type'],
                },
            }
            
            request_url = base_url + '/api/v1/logistic-request'
            let options = {
                url: request_url,
                formData: payload,
            }
            request_module.post(options, function (err, res, body) {
                if (err) 
                    return reply(replyHelper.constructErrorResponse(err)).code(422)

                if (res.statusCode >=300)
                    return reply(body).code(422)

                return reply(body).code(200)
            })
        },

    }//end

}
