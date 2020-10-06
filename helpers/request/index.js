const requestHeaders = (request) => {
  const query = request.query
  const user = request.auth.credentials.user

  return {
    "query" : query,
    "query" : user
  }
}

module.exports = {
  requestHeaders
}