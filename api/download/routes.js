module.exports = (server) => {
  const handlers = require('./handler');

  return [
    {
      method: 'GET',
      path: '/download',
      config: {
        description: 'Download Data',
        tags: ['api', 'download'],
      },
      handler: handlers.downloadData(server)
    }
  ]
}
