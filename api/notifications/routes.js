module.exports = (server) => {
  const handlers = require('./handlers')(server)

  const route = (method, path, callback)  => {
    return  {
      method: method,
      path: path,
      config: {
        auth: 'jwt',
        description: ` ${method} notifications`,
        tags: ['notifications'],
      },
      handler: handlers[callback],
    }
  }


  return [
     // Get user notifications
     route('GET', '/notifications', 'getUserNotifications'),
     route('PUT', '/notifications/read', 'markAsRead'),
     route('GET', '/notifications/summary', 'summary'),
  ]
}
