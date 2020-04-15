const replyHelper = require('../helpers')

module.exports = (server) => {
  function constructUserResponse(user) {
    let authUser = { 
      status : 200,
      message: true,
      data : user.toAuthJSON() 
    }
    return authUser
  }

  function constructUserMultipleResponse(user) {
    let authUser = { 
      status : 200,
      message: true,
      data : user 
    }
    return authUser
  }

  return {
    /**
     * GET /api/user
     * @param {*} request
     * @param {*} reply
     */
    async getCurrentUser (request, reply) {
      return reply(constructUserResponse(request.auth.credentials.user))
    },
    
    async updateMe(request, reply) {
      let payload = request.payload
      let user = request.auth.credentials.user
      server.methods.services.users.update(user, payload, (err, updatedUser) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(constructUserResponse(updatedUser))
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
      
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        if (!user) return reply().code(422)

        return reply(constructUserResponse(user))
      })
    },
    /**
     * POST /api/users/multiple
     * @param {*} request
     * @param {*} reply
     */
    async registerUserMultiple(request, reply) {
      let payload = request.payload
      server.methods.services.users.createUserMultiple(payload, (err, user) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        if (!user) return reply().code(422)

        return reply(constructUserMultipleResponse(user))
      })
    },
    /**
     * POST /api/users/login
     * @param {*} request
     * @param {*} reply
     */
    async loginUser(request, reply) {
      let payload = request.payload

      // method login menggunakna email
      // server.methods.services.users.getByEmail(payload.email, (err, user) => {
      //   if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

      //   if (!user) {
      //     return reply({
            // "status":404,
            // "message": 'email/user belum terdaftar!',
            // "data": null
      //     }).code(404)
      //   }

      //   if (!user.validPassword(payload.user.password)) {
      //     return reply({
            // "status":404,
            // "message": 'email/user belum terdaftar!',
            // "data": null
      //     }).code(401)
      //   }

      //   return reply(constructUserResponse(user))
      // });

      // method login menggunakan username
      server.methods.services.users.getByUsername(
        payload.username, 
        (err, user) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

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



    }

  }
}
