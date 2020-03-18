const replyHelper = require('../helpers')

module.exports = (server) => {
    function constructAreasResponse(areas) {
        let jsonAreas = {
            status: 200,
            message: "Success",
            data: areas
        }
        // return survey
        return jsonAreas
    }


    return {
        /**
         * GET /api/surveys/{id}/quetions
         * @param {*} request
         * @param {*} reply
         */
        async DistrictCity(request, reply){
            server.methods.services.areas.getDistrictCity(
                request.auth.credentials.user.code_district_city,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructAreasResponse(result)
                    ).code(200)
                }
            )
        },
        
        /**
         * GET /api/surveys/{id}/quetions
         * @param {*} request
         * @param {*} reply
         */
        async SubDistrict(request, reply) {
            server.methods.services.areas.getSubDistrict(
                request.params.city_code,
                (err, districs) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructAreasResponse(districs)
                    ).code(200)
                }
            )
        },

        /**
         * GET /api/surveys/{id}/quetions
         * @param {*} request
         * @param {*} reply
         */
        async Village(request, reply) {
            server.methods.services.areas.getVillage(
                request.params.district_code,
                (err, districs) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructAreasResponse(districs)
                    ).code(200)
                }
            )
        },


        /**
         * GET /api/surveys/{id}/quetions
         * @param {*} request
         * @param {*} reply
         */
        async Hospital(request, reply) {
            server.methods.services.areas.getHospital(
                request.query,
                (err, hospital) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructAreasResponse(hospital)
                    ).code(200)
                }
            )
        }
        


    }//end

}