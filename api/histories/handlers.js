const replyHelper = require('../helpers');

module.exports = (server) => {
    function constructHistorysResponse(histories) {
        let jsonHistories = {
            status: 200,
            message: "Success",
            data: histories
        }
        return jsonHistories
    }

    return {
        /**
         * GET /api/histories
         * @param {*} request
         * @param {*} reply
         */
        async ListHistory(_request, reply){
            server.methods.services.histories.list( (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructHistorysResponse(result)
                ).code(200)
            })
        },
        /**
         * POST /api/histories
         * @param {*} request
         * @param {*} reply
         */
        async CreateHistory(request, reply){
            let payload = request.payload
            server.methods.services.histories.createIfChanged(payload, (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructHistorysResponse(result)
                ).code(200)
            })
        },
        /**
         * GET /api/histories/{id}
         * @param {*} request
         * @param {*} reply
         */
        async GetHistoryDetail(request, reply) {
            let id = request.params.id
            server.methods.services.histories.getById(id, (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructHistorysResponse(item)
                ).code(200)
            })
        },
        /**
         * DELETE /api/histories/{id}
         * @param {*} request
         * @param {*} reply
         */
        async DeleteHistory(request, reply){
            return reply({ result: 'update history!' });
        },
        /**
         * PUT /api/history_cases/{id}
         * @param {*} request
         * @param {*} reply
         */
        async UpdateHistory(request, reply) {
          server.methods.services.histories.updateById(
            request.params.id,
            request.payload,
            (err, item) => {
            if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
            return reply(
              constructHistorysResponse(item)
            ).code(200)
          })
        },
    }//end

}
