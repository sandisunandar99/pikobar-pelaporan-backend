const { replyJson } = require('../helpers')
const callback = (reply) => {
  return (err, result) => replyJson(err, result, reply)
}

module.exports = (server) => {
  return {
    /**
     * GET /api/notifications
     * @param {*} request
     * @param {*} reply
     */
    async getUserNotifications (request, reply) {
      server.methods.services.notifications.get(
        request.auth.credentials.user._id, request.query, callback(reply))
    },

    /**
     * PUT /api/notifications/read
     * @param {*} request
     * @param {*} reply
     */
    async markAsRead (request, reply) {
      server.methods.services.notifications.markAsRead(request.query, callback(reply))
    },

    /**
     * GET /api/notifications/summary
     * @param {*} request
     * @param {*} reply
     */
    async summary (request, reply) {
      const { _id } = request.auth.credentials.user
      server.methods.services.notifications.summary(_id, callback(reply))
    }
  }
}
