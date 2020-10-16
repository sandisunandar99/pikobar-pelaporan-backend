const replyHelper = require('../../helpers')
const {
  validate,
  requestFileError,
  caseSheetExtraction,
} = require('../../../helpers/casesheet/index')


const BadRequest = (errors) => {
  return {
    status: 400,
    message: 'Bad request.',
    errors: errors,
  }
}

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

const sheetToJson = server => {
  return {
    method: async (request, reply) => {
      const payload = await caseSheetExtraction(request)

      if (requestFileError(payload)) {
        return reply(BadRequest(requestFileError(payload))).code(400).takeover()
      }

      const errors = await validate(payload)

      if (errors) {
        return reply(BadRequest(errors)).code(400).takeover()
      }

      return reply(paylod)
    },
    assign: 'sheet_to_json'
  }
}

module.exports = {
  sheetToJson,
  countCasesOutsideWestJava,
}
