const { funcCreatePayload, funcIfSame, funcWithParam } = require('../../helpers/request')

const createPublicPlace = (server) => {
  return async(request, reply) => {
    await funcCreatePayload(server, "public_place", "create", request, "id_case", reply)
  }
}

const getPublicPlace = (server) => {
  return async(request, reply) => {
    await funcIfSame(server, "public_place", "read", request, "id_case", reply)
  }
}

const updatePublicPlace = (server) => {
  return async(request, reply) => {
    await funcWithParam(server, "public_place", "update", request, "id_public_place", reply)
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