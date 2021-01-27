const findWithSort = async (schema, params, sort, callback) => {
  const result = await schema.find(params).sort(sort)
  return callback(null, result.map(result => result.toJSONFor()))
}

module.exports = {
  findWithSort
}