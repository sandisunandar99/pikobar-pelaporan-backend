const findWithSort = async (schema, params, sort, callback) => {
  const result = await schema.find(params).sort(sort).lean()
  return callback(null, result.map(result => result.toJSONFor()))
}

module.exports = {
  findWithSort
}