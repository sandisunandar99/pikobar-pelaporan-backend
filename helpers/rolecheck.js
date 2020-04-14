const ObjectId = require('mongoose').Types.ObjectId
const countByRole = (user, query) => {
  let searching = ''
  if (user.role == 'dinkeskota') {
    searching = {
      author:new ObjectId(user._id),
      author_district_code:user.code_district_city
    }
  } else if (user.role == 'dinkesprov' || user.role == 'superadmin') {
    searching = {}
  } else {
    searching = {
      author:new ObjectId(user._id)
    }
  }
  return searching
}

const exportByRole = (params, user, query) => {
  if (user.role == 'dinkeskota') {
    params.author = new ObjectId(user._id)
    params.author_district_code = user.code_district_city;
  } else if (user.role == 'dinkesprov' || user.role == 'superadmin') {
    
  } else {
    params.author = new ObjectId(user._id)
  }
  return params
}

const listByRole = (user, params, search_params, schema) => {
  let result_search
  if (search_params == null) {
    if(user.role == 'dinkeskota'){
      result_search = schema.find(params).where('delete_status').ne('deleted')
    }else if (user.role == 'dinkesprov' || user.role == 'superadmin') {
      result_search = schema.find(params).where('delete_status').ne('deleted')
    } else {
      result_search = schema.find({
        'author':new ObjectId(user._id)
      }).where('delete_status').ne('deleted')
    }
  } else {
    if (user.role == 'dinkeskota' || user.role == 'dinkesprov' || user.role == 'superadmin') {
      result_search = schema.find(params).or(search_params).where('delete_status').ne('deleted')
    } else {
      result_search = schema.find({
        'author':new ObjectId(user._id)
      }).or(search_params).where('delete_status').ne('deleted')
    }
  }
  return result_search
}

module.exports = {
  countByRole,
  exportByRole,
  listByRole
}