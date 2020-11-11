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

const routeOldNoPre = (handlers, method, path, description, callback) => {
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

module. exports = { configRoute, configWithValidation, routeOldNoPre }