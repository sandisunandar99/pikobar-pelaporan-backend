const { replyJson } = require('../helpers')

const sameExportCondition = async (server, request, reply, method) => {
  const query = request.query
  const { user } = request.auth.credentials
  return await server.methods.services.queue[method](
    query, user,
    (err, result) => replyJson(err, result, reply)
  )
}
/**
  *
  *
  * @param {*} server
  * @param {*} request
  * @param {*} reply
*/
const caseExport = (server) => {
  return async(request, reply) => await sameExportCondition(
    server, request, reply, 'queuCase',
  )
}

/**
  *
  *
  * @param {*} server
  * @param {*} request
  * @param {*} reply
*/
const historyExport = (server) => {
  return async(request, reply) => await sameExportCondition(
    server, request, reply, 'queuHistory',
  )
}

/**
  *
  *
  * @param {*} server
  * @param {*} request
  * @param {*} reply
*/
const listExport = (server) => {
  return async(request, reply) => await sameExportCondition(
    server, request, reply, 'listExport',
  )
}

/**
  *
  *
  * @param {*} server
  * @param {*} request
  * @param {*} reply
*/
const resendFile = (server) => {
  return async(request, reply) => {
    await server.methods.services.queue.resendFile(
      request.payload,
      request.auth.credentials.user,
      (err, result) => replyJson(err, result, reply)
    )
  }
}

/**
  *
  *
  * @param {*} server
  * @param {*} request
  * @param {*} reply
*/
const cancelJob = (server) => {
  return async(request, reply) => {
    await server.methods.services.queue.cancelJob(
      request.query,
      request.payload,
      request.auth.credentials.user,
      (err, result) => replyJson(err, result, reply)
    )
  }
}

module.exports = {
  caseExport, historyExport, listExport, resendFile, cancelJob
}