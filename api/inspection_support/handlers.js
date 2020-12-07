const { funcCreatePayload, funcIfSame, queryParamSame } = require('../../helpers/request')

const createInspectionSupport = (server) => {
  return async(request, reply) => {
    await funcCreatePayload(server, "inspection_support", "create", request, "id_case", reply)
  }
}

const getInspectionSupport = (server) => {
  return async(request, reply) => {
    await funcIfSame(server, "inspection_support", "read", request, "id_case", reply)
  }
}

const updateInspectionSupport = (server) => {
  return async(request, reply) => {
    await queryParamSame(
      server, "inspection_support", "update",
      request, "payload", "id_inspection_support", reply
    )
  }
}

const deleteInspectionSupport = (server) => {
  return async(request, reply) => {
    await funcIfSame(server, "inspection_support", "delete", request,
    "id_inspection_support", reply)
  }
}

module.exports = {
  createInspectionSupport,
  getInspectionSupport,
  updateInspectionSupport, deleteInspectionSupport
}