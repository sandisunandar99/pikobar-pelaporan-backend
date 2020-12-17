module.exports = (server) => {
  const handlers = require('./handlers')(server)

  return [
     // Get user notifications
    {
      method: 'GET',
      path: '/notifications',
      config: {
        auth: 'jwt',
        description: 'Get user notifications by user id',
        tags: ['notifications'],
      },
      handler: handlers.getUserNotifications
    },
    // Get user notifications detail
    {
      method: 'PUT',
      path: '/notifications/read',
      config: {
        auth: 'jwt',
        description: 'mark as read notification',
        tags: ['notifications'],
      },
      handler: handlers.markAsRead
    },
  ]
}
