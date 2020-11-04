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


module.exports = {
  ListRdt,
  CreateRdt,
  CreateRdtMultiple,
  GetRdtDetail
}


// module.exports = (server) => {
//     return {

//         async GetRdtHistories(request, reply) {
//             server.methods.services.rdt.getHistoriesByRdtId(request.params.id, (err, item) => {
//                 if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
//                 return reply(
//                     constructRdtResponse(item)
//                 ).code(200)
//             })
//         },

//         async UpdateRdt(request, reply){
//             server.methods.services.rdt.update(
//                 request.params.id, request.payload, request.auth.credentials.user,
//                 (err, result) => {
//                     if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
//                     return reply(
//                         constructRdtResponse(result)
//                     ).code(200)
//                 }
//             )
//         },

//         async DeleteRdt(request, reply) {
//             server.methods.services.rdt.softDeleteRdt(
//                 request.pre.rdt,
//                 // request.pre.cases,
//                 request.auth.credentials.user,
//                 (err, item) => {
//                     if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
//                      return reply(
//                          constructRdtResponse(item)
//                      ).code(202)
//                 })
//         },

//         async GetListIdCase(request, reply) {
//             server.methods.services.rdt.FormSelectIdCase(
//                 request.query,
//                 request.auth.credentials.user,
//                 request.pre.data_pendaftaran,
//                 (err, result) => {
//                     if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
//                     return reply(
//                         constructRdtResponse(result, request)
//                     ).code(200)
//             })
//         },

//         async GetListIdCaseDetail(request, reply) {
//             server.methods.services.rdt.FormSelectIdCaseDetail(
//                 request.pre.search_internal,
//                 request.pre.search_external,
//                 // request.auth.credentials.user,
//                 (err, result) => {
//                     if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
//                     return reply(
//                         constructRdtResponse(result, request)
//                     ).code(200)
//             })
//         },

//         async GetListRegisteredUser(request, reply) {
//             server.methods.services.rdt.getRegisteredUser(
//                 request.pre.reg_user_external,
//                 request.auth.credentials.user,
//                 (err, result) => {
//                     if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
//                     return reply(
//                         constructRdtResponse(result, request)
//                     ).code(200)
//             })
//         },

//         async formLocationTest(request, reply) {
//             server.methods.services.rdt.getLocationTest(
//                 (err, result) => {
//                     if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
//                     return reply(
//                         constructRdtResponse(result, request)
//                     ).code(200)
//             })
//         },

//         async GetRdtSummaryByCities(request, reply) {
//               server.methods.services.rdt.GetRdtSummaryByCities(
//                   request.query,
//                   (err, result) => {
//                       if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
//                       return reply(
//                           constructRdtResponse(result, request)
//                       ).code(200)
//                   })
//         },

//         async GetRdtSummaryResultByCities(request, reply) {
//               server.methods.services.rdt.GetRdtSummaryResultByCities(
//                   request.query,
//                   (err, result) => {
//                       if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
//                       return reply(
//                           constructRdtResponse(result, request)
//                       ).code(200)
//                   })
//         },

//         async GetRdtSummaryResultListByCities(request, reply) {
//               server.methods.services.rdt.GetRdtSummaryResultListByCities(
//                   request.query,
//                   (err, result) => {
//                       if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
//                       return reply(
//                           constructRdtResponse(result, request)
//                       ).code(200)
//                   })
//         },

//         async GetRdtFaskesSummaryByCities(request, reply) {
//               server.methods.services.rdt.GetRdtFaskesSummaryByCities(
//                   request.query,
//                   (err, result) => {
//                       if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
//                       return reply(
//                           constructRdtResponse(result, request)
//                       ).code(200)
//                   })
//         },

//         async sendMessage(result) {
//             server.methods.services.rdt.sendMessagesSMS(
//                 request.query,
//                 (err, result) => {
//                     if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
//                     return reply(
//                         constructRdtResponse(result, request)
//                     ).code(200)
//                 })
//             server.methods.services.rdt.sendMessagesWA(
//                 request.query,
//                 (err, result) => {
//                     if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
//                     return reply(
//                         constructRdtResponse(result, request)
//                     ).code(200)
//                 })
//         }

//     }//end

// }