const {replyJson} = require('../helpers')
const {queryIfSame} = require('../../helpers/request')


const ListOccupation = (server) => {
  return async(request, reply) => {
    await queryIfSame(server, "occupations", "getOccupation", request, reply)
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