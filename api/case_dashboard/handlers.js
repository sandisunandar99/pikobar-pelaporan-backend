'use strict'
const { replyJson } = require('../helpers')

const countSectionTop = (server) => {
  return (request, reply) => {
    server.methods.services.case_dashboard.countSectionTop(
      request.query,
      request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const countSummary = (server) => {
  return (request, reply) => {
    const { query } = request
    const { user } = request.auth.credentials
    server.methods.services.case_dashboard.countSummary(
      query, user,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const countVisualization = (server) => {
  return (request, reply) => {
    const { query } = request
    const { user } = request.auth.credentials
    server.methods.services.case_dashboard.countVisualization(
      query, user,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}
module.exports = {
  countSectionTop,
  countSummary,countVisualization
}