const replyHelper = require('../helpers')
const json2xls = require('json2xls')
const moment = require('moment')
const fs = require('fs')
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
        async exportHistory(request, reply){
          let query = request.query
          const fullName = request.auth.credentials.user.fullname.replace(/\s/g, '-')
          server.methods.services.histories.listHistoryExport(
            query, request.auth.credentials.user, (err, result) => {
              if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
              const jsonXls = json2xls(result);
              const fileName = `Data-Riwayat-Info-Klinis-${fullName}-${moment().format("YYYY-MM-DD-HH-mm")}.xlsx`
              fs.writeFileSync(fileName, jsonXls, 'binary');
              const xlsx = fs.readFileSync(fileName)
              reply(xlsx)
              .header('Content-Disposition', 'attachment; filename='+fileName);
              return fs.unlinkSync(fileName);
          })
      },
    }//end

}
