const replyHelper = require('../helpers')

module.exports = (server) => {
    function constructAreasResponse(country) {
        let jsonCountry = {
            status: 200,
            message: "Success",
            data: country
        }
        return jsonCountry
    }

    return {
        /**
         * GET /api/country
         * @param {*} request
         * @param {*} reply
         */
        async listCountry(request, reply) {
            server.methods.services.country.getCountryList(
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructAreasResponse(result)
                    ).code(200)
                }
            )
        },
    } //end
}