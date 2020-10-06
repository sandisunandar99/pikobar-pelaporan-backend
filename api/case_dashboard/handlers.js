'use strict'
const { replyJson } = require('../helpers')
const { requestHeaders } = require('../../helpers/request')

const countSectionTop = (server) => {
  return (request, reply) => {
    server.methods.services.case_dashboard.countSectionTop(
      requestHeaders(request).query,
      requestHeaders(request).user,
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
    server.methods.services.case_dashboard.countVisualization(
      requestHeaders(request).query,
      requestHeaders(request).user,
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