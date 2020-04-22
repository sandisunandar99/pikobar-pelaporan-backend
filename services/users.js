require('../models/User');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = mongoose.model('User');
const Check = require('../helpers/rolecheck');
const Helper = require('../helpers/custom');

const listUser = async (user, query, callback) => {

  const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    meta: '_meta'
  };

  const sorts = (query.sort == "desc" ? {_id:"desc"} : JSON.parse(query.sort));
  const options = {
    page: query.page,
    limit: query.limit,
    sort: sorts,
    leanWithId: true,
    customLabels: myCustomLabels,
  };

  let result_search;
  let params = {};
  params = Check.userByRole(params,user);
  if(query.search){
    var search_params = [
      { username : new RegExp(query.search,"i") },
      { fullname: new RegExp(query.search, "i") },
      { email: new RegExp(query.search, "i") },
      { phone_number: new RegExp(query.search, "i"), },
    ];
    result_search = User.find(params).or(search_params).where("delete_status").ne("deleted");
  } else {
    result_search = User.find(params).where("delete_status").ne("deleted");
  }

  User.paginate(result_search, options).then(function(results){
    const res = {
      users: results.itemsList.map(users => users.toJSONFor()),
      _meta: results._meta,
    }
    return callback(null, res);
  }).catch(err => callback(err, null));
}

const getUserByEmail = (email, callback) => {
  User.findOne({ email }, (err, user) => {
    if (err) return callback(err, null);
    return callback(null, user);
  });
}

const getUserById = async (id, callback) => {
  try {
    const result = await User.findById(id);
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

const getUserByUsername = (username, callback) => {
  User.findOne({ username }, (err, user) => {
    if (err) return callback(err, null);
    return callback(null, user);
  });
}

const createUser = async (payload, callback) => {
  try {
    payload.salt = crypto.randomBytes(16).toString('hex')
    payload.hash = crypto.pbkdf2Sync(payload.password, payload.salt, 10000, 512, 'sha512').toString('hex')
    payload.password = Helper.setPwd(payload.password)
  
    const user = new User(payload);
    const result = await user.save();
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

const updateUser = (user, payload, callback) => {
  let passwords = user.setPassword(payload.password)
  let users = {
    fullname: payload.fullname ? payload.fullname : user.fullname,
    username: payload.username ? payload.username : user.username,
    password: passwords,
    email: payload.email ? payload.email: user.email,
    role: payload.role ? payload.role: user.role,
    code_district_city: payload.code_district_city ? payload.code_district_city : user.code_district_city,
    name_district_city: payload.name_district_city ? payload.name_district_city : user.name_district_city
  }
  
  user = Object.assign(user, users)

  user.save((err, user) => {
    if (err) return callback(err, null);
    return callback(null, user);
  });
}

const updateUsers = async (id, payload, category, author, callback) =>{
  try {
    if(category == "delete"){
      const date = new Date();
      const payload = {};
      payload.delete_status = "deleted";
      payload.deletedAt = date.toISOString();
      payload.deletedBy = author;
    }
    const result = await User.findByIdAndUpdate(id,
    { $set: payload }, { new: true })
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.users.getByEmail',
    method: getUserByEmail
  },
  {
    name: 'services.users.listUser',
    method: listUser
  },
  {
    name: 'services.users.getById',
    method: getUserById
  },
  {
    name: 'services.users.getByUsername',
    method: getUserByUsername
  },
  {
    name: 'services.users.create',
    method: createUser
  },
  {
    name: 'services.users.update',
    method: updateUser
  },
  {
    name: 'services.users.updateUsers',
    method: updateUsers
  }
];
 