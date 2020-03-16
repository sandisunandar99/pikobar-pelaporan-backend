var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
var crypto = require('crypto')
var jwt = require('jsonwebtoken')
var config = require('../config/config')


var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  bio: String,
  avatar: String,
  hash: String,
  salt: String
}, {timestamps: true})

UserSchema.plugin(uniqueValidator, {message: 'sudah terdaftar.'})

UserSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.hash === hash
} 

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UserSchema.methods.generateJWT = function () {
  var today = new Date()
  var exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  }, config.auth.secret, {algorithm: config.auth.algorithm})
}

UserSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    token: this.generateJWT()
  }
}

UserSchema.methods.toProfileJSONFor = function (user) {
  return {
    id : this._id,
    username: this.username,
    bio: this.bio || null,
    avatar: this.avatar || null
  }
}

UserSchema.methods.authorSurvey = function (user) {
  return {
    id: this._id,
    username: this.username
  }
}


module.exports = mongoose.model('User', UserSchema)
