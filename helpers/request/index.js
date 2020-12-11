const { replyJson } = require('../../api/helpers')

const funcIfSame = async (server, name, methods, request, param, reply) => {
  server.methods.services[name][methods](
    request.params[param],
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const queryIfSame = async (server, name, methods, request, reply) => {
  server.methods.services[name][methods](
    request.query,
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const queryParamSame = async (server, name, methods, request, req, param, reply) => {
  server.methods.services[name][methods](
    request.params[param],
    request[req],
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const funcNoParam = async (server, name, methods, reply) => {
  server.methods.services[name][methods](
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const funcCreate = async (server, name, methods, request, reply) => {
  server.methods.services[name][methods](
    request,
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const requestIfSame = async (server, name, methods, request, reply) => {
  const { query } = request
  const { user } = request.auth.credentials
  server.methods.services[name][methods](
    query, user,
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const funcCreatePayload = async (server, name, methods, request, param, reply) => {
  server.methods.services[name][methods](
    request.payload,
    request.params[param],
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const funcCreateDynamic = async (server, name, methods, request, req, user, reply) => {
  server.methods.services[name][methods](
    request[req],
    request[user],
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

module.exports = {
  funcIfSame, queryIfSame, queryParamSame, funcNoParam,
  funcCreate, requestIfSame, funcCreatePayload, funcCreateDynamic
}
