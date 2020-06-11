const register = (server, options, next) => {

  const preResponse = (request, reply) => {
    let response = request.response

    // console.log('RESPONSE :', response);
     //console.log('RESPONSE_HEADER:', request.headers);
     //console.log('SERVER:', server.registrations);

    if (response.isBoom) {
      const reformated = {}
      reformated.status = response.output.statusCode
      reformated.message = response.output.payload.message
      reformated.data = null
      return reply(reformated).code(response.output.statusCode)
    }
    return reply.continue()
  }

  const onRequest = (request, reply) =>{
    // check status error jika sudah stack tidak ketemu masalahnya bisa dilihat disini !!
    // console.log('INFO:', request.info);
    // console.log('HEADERS:', request.headers);
    return reply.continue()
  }

  const format = (seconds) => {
    const pad = (s) => {
      return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60*60));
    var minutes = Math.floor(seconds % (60*60) / 60);
    var seconds = Math.floor(seconds % 60);
  
    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  }

  server.register(require('./users'))
  server.register(require('./areas'))
  server.register(require('./cases'))
  server.register(require('./histories'))
  server.register(require('./occupations'))
  server.register(require('./rdt'))
  server.register(require('./category'))
  server.register(require('./country'));
  server.register(require('./dashboard'));
  server.register(require('./logistics'));
  server.register(require('./map'));
  server.register(require('./unit'));

  server.ext('onPreResponse', preResponse)
  server.ext('onRequest', onRequest)

  server.route({
    method: 'GET',
    path: '/status',
    config: {
      description: 'Check status',
      notes: 'Check status of the API',
      tags: ['api', 'status']
    },
    handler: (request, reply) => {
      return reply({status: `UP in: ${format(require('os').uptime())}`})
    }
  })

  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register
