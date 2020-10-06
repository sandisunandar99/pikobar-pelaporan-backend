const requestHeaders = (request) => {
  const query = request.query
  const user = request.auth.credentials.user

  return {
    "query" : query,
    "user" : user
  }
}

module.exports = {
  requestHeaders
}