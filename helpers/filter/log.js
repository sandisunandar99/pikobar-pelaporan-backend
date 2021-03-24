const filterLogQueue = (user, query) => {
  const params = {}
  params.author = user.id

  return params
}
module.exports = {
  filterLogQueue
}