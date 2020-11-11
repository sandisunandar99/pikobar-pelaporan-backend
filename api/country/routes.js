module.exports = (handlers) => {
  return [{
    method: 'GET',
    path: '/country',
    config: {
      auth: 'jwt',
      description: 'show country list',
      tags: ['api', 'country list'],
    },
    handler: handlers.listCountry
  }, {
    method: 'GET',
    path: '/menu',
    config: {
      auth: 'jwt',
      description: 'show menu',
      tags: ['api', 'menu'],
    },
    handler: handlers.listMenu
  }]
}