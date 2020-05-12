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

            payload['user_id'] = user._id

            // fill with hospital data
            payload['master_faskes_id'] = null
            payload['agency_type'] = null
            payload['agency_name'] = null
            
            request_url = base_url + '/api/v1/logistic-request'
            request_module.post(
              request_url,
              {
                json: payload,
              },
              (err, res, body) => {
                  if (err) 
                      return reply(replyHelper.constructErrorResponse(err)).code(422)

                  if (res.statusCode >=300)
                      return reply(body).code(422)

                  return reply(
                      constructLogisticsResponse(body)
                  ).code(200)
              }
            )
        },

    }//end

}
