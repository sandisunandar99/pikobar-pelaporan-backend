require('dotenv').config()
const { assert } = require('chai')
process.env.NODE_ENV = 'test'
const urls = `/login`
const { methodSame } = require('./index')

const users = {
  username: process.env.USERS,
  password: process.env.PASSWORD
}

describe('Users Functional Test', () => {
  describe('/POST Login user', () => {
    it('it should login with valid user', (done) => {
      assert.typeOf(users.username, 'string')
      assert.typeOf(users.password, 'string')
      methodSame(urls, users, 'post', 200, done)
    })
  })

  describe('/POST Login user', () => {
    it('it should login with invalid user', (done) => {
      users.username = 'user12'
      users.password = '123'
      assert.typeOf(users.username, 'string')
      assert.typeOf(users.password, 'string')
      methodSame(urls, users, 'post', 404, done)
    })
  })

  describe('/POST Login user', () => {
    it('it should login with valid user and invalid password', (done) => {
      users.username = process.env.USERS
      users.password = '123'
      assert.typeOf(users.username, 'string')
      assert.typeOf(users.password, 'string')
      methodSame(urls, users, 'post', 401, done)
    })
  })
})
