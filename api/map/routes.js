module.exports = (server, route) => {
  return [
    route(server, 'GET', '/map', 'map', 'mapList'),
  ]
}