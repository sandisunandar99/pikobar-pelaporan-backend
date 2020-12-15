const { funcCreateDynamic, funcIfSame, queryParamSame } = require('../../helpers/request')

const createPublicPlace = (server) => {
  return async(request, reply) => {
    await funcCreateDynamic(server, "public_place", "create", request,
    "payload", request.params.id_case, reply
    )
  }
}

const getPublicPlace = (server) => {
  return async(request, reply) => {
    await funcIfSame(server, "public_place", "read", request, "id_case", reply)
  }
}

const updatePublicPlace = (server) => {
  return async(request, reply) => {
    await queryParamSame(
      server, "public_place", "update",
      request, "payload", "id_public_place", reply
    )
  }
}

const deletePublicPlace = (server) => {
  return async(request, reply) => {
    await funcIfSame(server, "public_place", "delete", request, "id_public_place", reply)
  }
}

module.exports = {
  createPublicPlace, getPublicPlace,  updatePublicPlace, deletePublicPlace
}