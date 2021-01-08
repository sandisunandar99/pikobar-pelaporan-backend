const { replyJson, constructErrorResponse } = require('../helpers')

function constructUserResponse(user) {
  let authUser = {
    status : 200,
    message: true,
    data : user.toAuthJSON()
  }
  return authUser
}

const sameMethod = (server, req, rep, method, status) => {
  server.methods.services.users[method](
    req.params.id,
    req.payload,
    status,
    req.auth.credentials.user._id,
    (err, result) => { replyJson(err, result, rep) }
  )
}

const sameQuery = (server, req, rep, method) => {
  server.methods.services.users[method](
    req.auth.credentials.user,
    req.query,
    (err, result) => { replyJson(err, result, rep) }
  )
}

const sameRequest = (server, req, rep, status) => {
  server.methods.services.users.getById(
    req.params.id, status, (err, result) => {
      replyJson(err, result, rep)
  });
}

module.exports = (server) => {

  return {
    /**
     * GET /api/users
     * @param {*} request
     * @param {*} reply
     */
    async getListUser (request, reply) {
      sameQuery(server, request, reply, 'listUser')
    },
    /**
     * GET /api/users/{id}
     * @param {*} request
     * @param {*} reply
     */
    async getUserById (request, reply) {
      sameRequest(server, request, reply, 'update')
    },
    /**
     * GET /api/users/username/{value}
     * @param {*} request
     * @param {*} reply
     */
    async getUserByUsername (request, reply) {
      server.methods.services.users.getBySpecifiedKey(
        'username', request.params.value, (err, userById) => {
          replyJson(err, userById, reply)
      });
    },
    /**
     * PUT /api/users/reset/{id}
     * @param {*} request
     * @param {*} reply
     */
    async resetPassword (request, reply) {
      sameRequest(server, request, reply, 'reset')
    },
    /**
     * GET /api/users/{id}
     * @param {*} request
     * @param {*} reply
     */
    async checkUser (request, reply) {
      server.methods.services.users.checkUser(
        request.query, (err, listUser) => {
          replyJson(err, listUser, reply)
      });
    },
    /**
     * GET /api/users
     * @param {*} request
     * @param {*} reply
     */
    async getCurrentUser (request, reply) {
      return reply(constructUserResponse(request.auth.credentials.user))
    },
    /**
     * GET /api/users/faskes
     * @param {*} request
     * @param {*} reply
     */
    async getFaskesOfCurrentUser (request, reply) {
      server.methods.services.users.getFaskesOfUser(
        request.auth.credentials.user, (err, listUser) => {
          replyJson(err, listUser, reply)
      });
    },
    /**
     * DELETE /api/users/{id}
     * @param {*} request
     * @param {*} reply
     */
    async deleteUsers (request, reply) {
      sameMethod(server, request, reply, 'updateUsers', 'delete')
    },
    /**
     * PUT /api/users/{id}
     * @param {*} request
     * @param {*} reply
     */
    async updateUsers (request, reply) {
      sameMethod(server, request, reply, 'updateUsers', 'update')
    },
    /**
     * PUT /api/users/change-password
     * @param {*} request
     * @param {*} reply
     */
    async updateMe(request, reply) {
      let payload = request.payload
      let user = request.auth.credentials.user
      server.methods.services.users.update(user, payload, (err, updatedUser) => {
        replyJson(err, updatedUser, reply)
      })
    },
    /**
     * POST /api/users
     * @param {*} request
     * @param {*} reply
     */
    async registerUser(request, reply) {
      let payload = request.payload
      server.methods.services.users.create(payload, (err, user) => {
      // TODO: Better error response
        replyJson(err, user, reply)
      })
    },
    /**
     * POST /api/users/login
     * @param {*} request
     * @param {*} reply
     */
    async loginUser(request, reply) {
      let payload = request.payload
      server.methods.services.users.getByUsername(
        payload.username,
        (err, user) => {
        if (err) return reply(constructErrorResponse(err)).code(422)

        if (!user) {
          return reply({
            "status":404,
            "message": 'username atau password salah!',
            "data": null
          }).code(404)
        }

        if (!user.validPassword(payload.password)) {
          return reply({
            "status":404,
            "message": 'username atau password salah!',
            "data": null
          }).code(401)
        }

        return reply(constructUserResponse(user))
      });
    },
    /**
     * GET /api/users-listid
     * @param {*} request
     * @param {*} reply
     */
    async getListUserIds (request, reply) {
      sameQuery(server, request, reply, 'listUserIds')
    },
    /**
     * PUT /api/users/{id}/devices
     * @param {*} request
     * @param {*} reply
     */
    async updateUserDevice (request, reply) {
      server.methods.services.users.updateUserDevice(
        request.params.id, request.payload,
        request.auth.credentials.user._id,
        (err, res) => {
          replyJson(err, res, reply)
      })
    },
  }
}
