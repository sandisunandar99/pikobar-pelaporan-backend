const register = async(server, options, next) => {
    await require('./lapor_mandiri')(server)
    await require('./labkes_pelaporan')(server)
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register