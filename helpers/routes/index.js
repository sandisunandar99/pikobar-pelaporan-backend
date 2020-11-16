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

module.exports = { configRoute, configWithValidation, configRouteComplete }