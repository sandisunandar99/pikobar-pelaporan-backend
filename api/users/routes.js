const inputValidations = require('./validations/input');
const outputValidations = require('./validations/output');

module.exports = (server) => {
  const handlers = require('./handlers')(server)
  return [
    // Get list user
    {
      method: 'GET',
      path: '/users',
      config: {
        auth: 'jwt',
        description: 'Get list user',
        validate: inputValidations.UserQueryValidations,
        tags: ['api', 'users']
      },
      handler: handlers.getListUser
    },
    // Get user by id
    {
      method: 'GET',
      path: '/users/{id}',
      config: {
        auth: 'jwt',
        description: 'Get user by id',
        tags: ['api', 'users']
      },
      handler: handlers.getUserById
    },
    // Reset password by id
    {
      method: 'PUT',
      path: '/users/reset/{id}',
      config: {
        auth: 'jwt',
        description: 'Reset user by id',
        tags: ['api', 'users']
      },
      handler: handlers.resetPassword
    },
    // Get user by email or username
    {
      method: 'GET',
      path: '/users/check',
      config: {
        auth: 'jwt',
        description: 'Get current info user',
        tags: ['api', 'users']
      },
      handler: handlers.checkUser
    },
    // Get current user
    {
      method: 'GET',
      path: '/users/info',
      config: {
        auth: 'jwt',
        validate: inputValidations.GetCurrentPayload,
        response: outputValidations.AuthOutputValidationConfig,
        description: 'Get current info user',
        tags: ['api', 'users']
      },
      handler: handlers.getCurrentUser
    },
    // Update user
    {
      method: 'PUT',
      path: '/users/change-password',
      config: {
        auth: 'jwt',
        validate: inputValidations.UpdatePayload,
        response: outputValidations.AuthOnPutOutputValidationConfig,
        description: 'Update me in user',
        tags: ['api', 'users']
      },
      handler: handlers.updateMe
    },
    // Soft delete user
    {
      method: 'DELETE',
      path: '/users/{id}',
      config: {
        auth: 'jwt',
        description: 'Soft delete user',
        tags: ['api', 'users']
      },
      handler: handlers.deleteUsers
    },
    // UPDATE user
    {
      method: 'PUT',
      path: '/users/{id}',
      config: {
        auth: 'jwt',
        description: 'update user',
        tags: ['api', 'users']
      },
      handler: handlers.updateUsers
    },
    // Register
    {
      method: 'POST',
      path: '/users',
      config: {
        validate: inputValidations.RegisterPayload,
        response: outputValidations.AuthOnRegisterOutputValidationConfig,
        description: 'Add user',
        tags: ['api', 'users']
      },
      handler: handlers.registerUser
    },
    // Login
    {
      method: 'POST',
      path: '/login',
      config: {
        validate: inputValidations.LoginPayload,
        response: outputValidations.AuthOnLoginOutputValidationConfig,
        description: 'Login  user',
        tags: ['api', 'users'],
      },
      handler: handlers.loginUser
    }
  ]
}
