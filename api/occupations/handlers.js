const {
  replyJson
} = require('../helpers')

const ListOccupation = (server) => {
  return (request, reply) => {
    server.methods.services.occupations.getOccupation(
      request.query,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const GetOccupationDetail = (server) => {
  return (id, reply) => {
    server.methods.services.occupations.getOccupationDetail(
      id,
      (err, occupations) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(
          constructAreasResponse(occupations)
        ).code(200)
      }
    )
  }
}


module.exports = {
ListOccupation, GetOccupationDetail
}