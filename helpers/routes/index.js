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

const configData = (method, description) => {
  return {
    config: {
      description: ` ${method} ${description}`,
      tags: ['api', `${description}`],
      auth: 'jwt',
    }
  }
}

const routeOldNoPre = (server, method, path, description, callback) => {
  const handlers = require(`../../api/${description}/handlers`)(server)
  return {
    method: method,
    path: path,
    ...configData(method, description),
    handler: handlers[callback],
  }
}

const routeNoPreNew = (server, method, path, description, callback) => {
  const handlers = require(`../../api/${description}/handlers`)
  return {
    method: method,
    path: path,
    ...configData(method, description),
    handler: handlers[callback](server),
  }
}

const configRouteComplete = (method, path, validates, pre, tag, callback)=> {
  return {
    method: method,
    path: path,
    config: {
      auth: 'jwt',
      description: `${method} ${tag}`,
      tags: [ 'api', tag ],
      pre: pre,
      validate: validates
    },
    handler: callback,
  }
}

module. exports = {
  configRoute, configWithValidation, routeOldNoPre,
  routeNoPreNew, configRouteComplete
}
