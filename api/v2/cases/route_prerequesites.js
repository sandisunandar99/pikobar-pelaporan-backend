const replyHelper = require('../../helpers')

const countCasesOutsideWestJava = server => {
  return {
    method: (request, reply) => {
      server.methods.services.v2.cases.getCaseCountsOutsideWestJava(
        request.auth.credentials.user.code_district_city,
        (err, res) => {
          if (err) {
            return reply(replyHelper.constructErrorResponse(err))
              .code(422)
              .takeover()
          }
          return reply(res)
        })
    },
    assign: 'case_count_outside_west_java'
  }
}

module.exports = {
  countCasesOutsideWestJava,
}
