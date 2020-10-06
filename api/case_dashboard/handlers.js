'use strict'
const { replyJson } = require('../helpers')

const requestIfSame = (server, request, reply, func) => {
  const { query } = request
  const { user } = request.auth.credentials
  server.methods.services.case_dashboard[func](
    query, user,
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const countSectionTop = (server) => {
  return (request, reply) => requestIfSame(server, request, reply, 'countSectionTop')
}

const countSummary = (server) => {
  return (request, reply) => requestIfSame(server, request, reply, 'countSummary')
}

const countVisualization = (server) => {
  return (request, reply) => requestIfSame(server, request, reply, 'countVisualization')
}
module.exports = {
  countSectionTop,
  countSummary,countVisualization
}