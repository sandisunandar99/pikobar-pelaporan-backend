const replyHelper = require('../helpers')

const downloadData = (server) => {
  return (request, reply) => {
    let { query } = request
    server.methods.services.download.downloadData(
      query, (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(result.Body)
          .encoding('binary')
          .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
          .header('content-disposition', `attachment; filename=${query.file};`);
      })
  }
}

module.exports = {
  downloadData
}