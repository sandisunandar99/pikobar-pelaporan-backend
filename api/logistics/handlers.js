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
         * POST /api/logistics/requests
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

                let res_body = JSON.parse(body)

                if (res.statusCode >=300)
                    return reply(res_body).code(422)

                return reply(res_body).code(200)
            })
        },

        /**
         * GET /api/logistics/products
         * @param {*} request
         * @param {*} reply
         */
        async ListLogisticProducts(request, reply){
            let base_url = process.env.URL_API_LOGISTIC
            let query = request.query
            
            request_url = base_url + '/api/v1/landing-page-registration/products'
            let options = {
                url: request_url,
                qs: query,
            }
            request_module.get(options, function (err, res, body) {
                if (err) 
                    return reply(replyHelper.constructErrorResponse(err)).code(422)

                let res_body = JSON.parse(body)

                if (res.statusCode >=300)
                    return reply(res_body).code(422)

                return reply(res_body).code(200)
            })
        },

        /**
         * GET /api/logistics/product-units/{id}
         * @param {*} request
         * @param {*} reply
         */
        async ListLogisticProductUnits(request, reply){
            let base_url = process.env.URL_API_LOGISTIC
            let id = request.params.id

            request_url = base_url + '/api/v1/landing-page-registration/product-unit/' + id
            request_module.get(request_url, function (err, res, body) {
                if (err) 
                    return reply(replyHelper.constructErrorResponse(err)).code(422)

                let res_body = JSON.parse(body)

                if (res.statusCode >=300)
                    return reply(res_body).code(422)

                return reply(res_body).code(200)
            })
        },

        /**
         * GET /api/logistics/faskes-types
         * @param {*} request
         * @param {*} reply
         */
        async ListFaskesType(request, reply){
            let base_url = process.env.URL_API_LOGISTIC
            let query = request.query
            
            request_url = base_url + '/api/v1/master-faskes-type'
            let options = {
                url: request_url,
                qs: query,
            }
            request_module.get(options, function (err, res, body) {
                if (err) 
                    return reply(replyHelper.constructErrorResponse(err)).code(422)

                let res_body = JSON.parse(body)

                if (res.statusCode >=300)
                    return reply(res_body).code(422)

                return reply(res_body).code(200)
            })
        },

    }//end

}
