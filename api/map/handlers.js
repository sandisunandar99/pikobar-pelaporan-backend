const replyHelper = require('../helpers');

module.exports = (server) => {
    const mapResponse = (map) => {
        let jsonMap = {
            status: 200,
            message: "Success",
            data: map,
        }
        return jsonMap;
    };

    return {
        /**
         * GET /api/map
         * @param {*} request
         * @param {*} reply
         */
        async mapList(request, reply) {
            server.methods.services.map.listMap(
                request.query,
                request.auth.credentials.user,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422);
                    return reply(mapResponse(result)).code(200);
                }
            )
        },
    } //end
}