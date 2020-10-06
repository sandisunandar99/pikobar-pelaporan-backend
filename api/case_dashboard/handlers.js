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
    server.methods.services.case_dashboard.countSummary(
      request.query,
      request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

module.exports = {
  countSectionTop,
  countSummary
}