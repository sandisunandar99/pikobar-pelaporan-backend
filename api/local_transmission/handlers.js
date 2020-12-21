const { funcCreateDynamic, funcIfSame, queryParamSame } = require('../../helpers/request')

const createLocalTransmission = (server) => {
  return async(request, reply) => {
    await funcCreateDynamic(server, "local_transmission", "create", request,
    "payload", request.params.id_case, reply
    )
  }
}

const getLocalTransmission = (server) => {
  return async(request, reply) => {
    await funcIfSame(server, "local_transmission", "read", request, "id_case", reply)
  }
}

const updateLocalTransmission = (server) => {
  return async(request, reply) => {
    await queryParamSame(
      server, "local_transmission", "update",
      request, "payload", "id_local_transmission", reply
    )
  }
}

const deleteLocalTransmission = (server) => {
  return async(request, reply) => {
    await funcIfSame(server, "local_transmission", "delete", request,
    "id_local_transmission", reply)
  }
}

module.exports = {
  createLocalTransmission,
  getLocalTransmission,
  updateLocalTransmission, deleteLocalTransmission
}