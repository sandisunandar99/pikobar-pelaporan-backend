const configRoute = (description, tags, role) => {
  return  {
    auth: 'jwt',
    description: description,
    tags: ['api', tags],
    pre: [ role ]
  }
}

const configWithValidation = (description, tags, validations, role) => {
  return  {
    auth: 'jwt',
    description: description,
    tags: ['api', tags],
    validate: validations.caseDashboard,
    pre: [ role ]
  }
}

const routeOldNoPre = (server, method, path, description, callback) => {
  const handlers = require(`../../api/${description}/handlers`)(server)
  return {
    method: method,
    path: path,
    config: {
      description: ` ${method} ${description}`,
      tags: ['api', `${description}`],
      auth: 'jwt',
    },
    handler: handlers[callback],
  }
}

const routeNoPreNew = (server, method, path, description, callback) => {
  const handlers = require(`../../api/${description}/handlers`)
  return {
    method: method,
    path: path,
    config: {
      description: ` ${method} ${description}`,
      tags: ['api', `${description}`],
      auth: 'jwt',
    },
    handler: handlers[callback](server),
  }
}

module. exports = {
  configRoute, configWithValidation, routeOldNoPre,
  routeNoPreNew
}