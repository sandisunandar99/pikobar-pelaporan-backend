const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = new mongoose.Schema({
  fullname: String,
  username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  role: { type: String, lowercase: true, required: [true, "can't be blank"]},
  code_district_city: { type: String, default: null},
  name_district_city: { type: String, default: null},
  phone_number: {type:String},
  address_street: {type:String},
  address_village_code: { type: String, required: [true, "can't be blank"]},
  address_village_name: { type: String, required: [true, "can't be blank"]},
  // kecamatan
  address_subdistrict_code: { type: String, required: [true, "can't be blank"]},
  address_subdistrict_name: { type: String, required: [true, "can't be blank"]},
  address_province_code: { type: String, default:32},
  address_province_name: { type: String, default:"Jawa Barat"},
  delete_status: String,
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hash: String,
  salt: String
}, {timestamps: true})

UserSchema.plugin(uniqueValidator, {
  message: 'sudah ada di basisdata'
});
UserSchema.plugin(mongoosePaginate);
UserSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
} ;
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}
UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  }, config.auth.secret, {algorithm: config.auth.algorithm})
}

UserSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    fullname: this.fullname,
    username: this.username,
    email: this.email,
    role: this.role,
    code_district_city: this.code_district_city,
    name_district_city: this.name_district_city,
    // hash: this.hash,
    // salt: this.salt,
    token: this.generateJWT()
  }
}

UserSchema.methods.toJSONFor = function () {
  return {
    id: this._id,
    fullname: this.fullname,
    username: this.username,
    email: this.email,
    role: this.role,
    code_district_city: this.code_district_city,
    name_district_city: this.name_district_city,
    phone_number: this.phone_number
  }
}

UserSchema.methods.JSONCase = function () {
  return {
    _id: this._id,
    fullname: this.fullname,
    code_district_city: this.code_district_city,
    name_district_city: this.name_district_city,
  }
}

UserSchema.methods.toProfileJSONFor = function (user) {
  return {
    id : this._id,
    username: this.username,
    role: this.role
  }
}

module.exports = mongoose.model('User', UserSchema)
