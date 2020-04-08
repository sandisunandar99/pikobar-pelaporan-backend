const countByRole = (user, query) => {
  let searching
  if (user.role == 'dinkeskota') {
    searching = {
      author: user._id,
      address_district_code: query.address_district_code
    }
  } else if (user.role == 'dinkesprov' || user.role == 'superadmin') {
    searching = {}
  } else {
    searching = {
      author: user._id
    }
  }
  return searching
}

const listByRole = (user, params, search_params, schema) => {
  let result_search
  if (search_params == null) {
    if (user.role == 'dinkeskota' || user.role == 'dinkesprov' || user.role == 'superadmin') {
      result_search = schema.find(params).where('status').ne('deleted')
    } else {
      result_search = schema.find({
        'author': user._id
      }).where('status').ne('deleted')
    }
  } else {
    if (user.role == 'dinkeskota' || user.role == 'dinkesprov' || user.role == 'superadmin') {
      result_search = schema.find(params).or(search_params).where('status').ne('deleted')
    } else {
      result_search = schema.find({
        'author': user._id
      }).or(search_params).where('status').ne('deleted')
    }
  }
  return result_search
}

module.exports = {
  countByRole,
  listByRole
}