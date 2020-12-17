const replyHelper = require('../helpers')
const { replyJson } = require('../helpers')
const callback = (reply) => {
  return (err, result) => replyJson(err, result, reply)
}

module.exports = (server) => {
  function constructUserResponse(user) {
    let authUser = {
      status : 200,
      message: true,
      data : user.toAuthJSON()
    }
    return authUser;
  }

  function constructUsersResponse(user) {
    let userResponse = {
      status : 200,
      message: true,
      data : user
    }
    return userResponse;
  }

  return {
    /**
     * GET /api/notifications
     * @param {*} request
     * @param {*} reply
     */
    async getUserNotifications (request, reply) {
      server.methods.services.notifications.get(
        request.auth.credentials.user._id, request.query, callback(reply));
    },
    /**
     * PUT /api/notifications/read
     * @param {*} request
     * @param {*} reply
     */
    async markAsRead (request, reply) {
      server.methods.services.notifications.markAsRead(request.query, callback(reply));
    }
  }
}
