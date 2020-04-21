require('../models/User');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = mongoose.model('User');
const Check = require('../helpers/rolecheck');

function listUser (user, query, callback) {

  const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    meta: '_meta'
  };

  const sorts = (query.sort == "desc" ? {_id:"desc"} : JSON.parse(query.sort))
  const options = {
    page: query.page,
    limit: query.limit,
    sort: sorts,
    leanWithId: true,
    customLabels: myCustomLabels
  };

  let result_search;
  let params={};
  params = Check.userByRole(params,user)
  if(query.search){
    var search_params = [
      { id_case : new RegExp(query.search,"i") },
      { name: new RegExp(query.search, "i") },
    ];
    result_search = User.find(params).or(search_params).where("deleted_status").ne("deleted")
  } else {
    result_search = User.find(params).where("deleted_status").ne("deleted")
  }

  User.paginate(result_search, options).then(function(results){
      let res = {
        users: results.itemsList.map(users => users.toJSONFor()),
        _meta: results._meta
      }
      return callback(null, res)
  }).catch(err => callback(err, null))
}

function getUserByEmail (email, callback) {
  User.findOne({ email }, (err, user) => {
    if (err) return callback(err, null);
    return callback(null, user);
  });
}


function getUserById (id, callback) {
  User.findById(id, (err, user) => {
    if (err) return callback(err, null);
    return callback(null, user);
  });
}

function getUserByUsername (username, callback) {
  User.findOne({ username }, (err, user) => {
    if (err) return callback(err, null);
    return callback(null, user);
  });
}

function createUser (payload, callback) {
  let user = new User();
  
  user.fullname = payload.fullname;
  user.username = payload.username;
  user.setPassword(payload.password);
  user.email = payload.email;
  user.role = payload.role;
  user.code_district_city = payload.code_district_city;
  user.name_district_city = payload.name_district_city;

  user.save((err, user) => {
    if (err) return callback(err, null);
    return callback(null, user);
  });
}

function setPwd(password){
  const salts = crypto.randomBytes(16).toString('hex')
  const hashing = crypto.pbkdf2Sync(password, salts, 10000, 512, 'sha512').toString('hex')
  return hashing
}

function createUserMultiple (payload, callback) {

  const payloadMultiple = payload.map(pay => {
    pay.username = pay.fullname.toLowerCase().replace(/\s+/g, '').replace(/[^a-zA-Z ]/g, "");
    pay.email = `${pay.username}@gmail.com`
    pay.salt = crypto.randomBytes(16).toString('hex')
    pay.password = setPwd(`${pay.username}890`)
    pay.hash = crypto.pbkdf2Sync(`${pay.username}890`, pay.salt, 10000, 512, 'sha512').toString('hex')
    return pay
  })

  User.create(payloadMultiple).then(_result => {
    callback(null,'success')
  }).catch(err => {
    callback(null,err)
  })
}

function updateUser (user, payload, callback) {
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
    name: 'services.users.createUserMultiple',
    method: createUserMultiple
  },
  {
    name: 'services.users.update',
    method: updateUser
  }
];
 