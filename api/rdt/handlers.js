const replyHelper = require('../helpers')
const {
  replyJson
} = require('../helpers')

const ListRdt = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.list(
      request.query,
      request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const CreateRdt = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.create(
      request.query,
      request.payload,
      request.auth.credentials.user,
      request.pre,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const CreateRdtMultiple = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.createMultiple(
      request.payload,
      request.auth.credentials.user,
      request.pre,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const GetRdtDetail = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.getById(request.params.id, (err, result) => {
      replyJson(err, result, reply)
    })
  }
}

const GetRdtHistories = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.getHistoriesByRdtId(request.params.id, (err, result) => {
      replyJson(err, result, reply)
    })
  }
}

const UpdateRdt = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.update(
      request.params.id, request.payload, request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const DeleteRdt = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.softDeleteRdt(
      request.pre.rdt,
      // request.pre.cases,
      request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const GetListIdCase = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.FormSelectIdCase(
      request.query,
      request.auth.credentials.user,
      request.pre.data_pendaftaran,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const GetListIdCaseDetail = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.FormSelectIdCaseDetail(
      request.pre.search_internal,
      request.pre.search_external,
      // request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const GetListRegisteredUser = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.getRegisteredUser(
      request.pre.reg_user_external,
      request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const formLocationTest = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.getLocationTest(
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const GetRdtSummaryByCities = (server) => {
  return (request, reply) => {
    const qByCity= request.query
    server.methods.services.rdt.GetRdtSummaryByCities(qByCity,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const GetRdtSummaryResultByCities = (server) => {
  return (request, reply) => {
    const qRBycity= request.query
    server.methods.services.rdt.GetRdtSummaryResultByCities(qRBycity,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const GetRdtSummaryResultListByCities = (server) => {
  return (request, reply) => {
    const qLbycity= request.query
    server.methods.services.rdt.GetRdtSummaryResultListByCities(qLbycity,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const GetRdtFaskesSummaryByCities = (server) => {
  return (request, reply) => {
     const qByFaskes = request.query
    server.methods.services.rdt.GetRdtFaskesSummaryByCities(qByFaskes,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const sendMessage = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.sendMessagesSMS(
      request.query,
      (err, result) => {
        replyJson(err, result, reply)
      })
    server.methods.services.rdt.sendMessagesWA(
      request.query,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

module.exports = {
  ListRdt,
  CreateRdt,
  CreateRdtMultiple,
  GetRdtDetail,
  GetRdtHistories,
  UpdateRdt,
  DeleteRdt,
  GetListIdCase,
  GetListIdCaseDetail,
  GetListRegisteredUser,
  formLocationTest,
  GetRdtSummaryByCities,
  GetRdtSummaryResultByCities,
  GetRdtSummaryResultListByCities,
  GetRdtFaskesSummaryByCities,
  sendMessage
}