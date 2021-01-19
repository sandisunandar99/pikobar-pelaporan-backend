require('dotenv').config()
const { assert } = require('chai')
process.env.NODE_ENV = 'test'
const urls = `/login`
const { methodSame } = require('./index')
const chai = require("chai")
const expect = chai.expect

const users = {
  username: process.env.USERS,
  password: process.env.PASSWORD
}

describe('Users Functional Test', () => {

  describe('/POST Login user', () => {
    it('it should login with valid user', async () => {
      assert.typeOf(users.username, 'string')
      assert.typeOf(users.password, 'string')
      const res = await methodSame(urls, 'post', users)
      expect(res.status).to.equal(200)
      expect(res.body).to.be.a('object')
    })
  })

  describe('/POST Login user', () => {
    it('it should login with invalid user', async () => {
      users.username = 'user12'
      users.password = '123'
      assert.typeOf(users.username, 'string')
      assert.typeOf(users.password, 'string')
      const res = await methodSame(urls, 'post', users)
      expect(res.status).to.equal(404)
      expect(res.body).to.be.a('object')
    })
  })

  describe('/POST Login user', () => {
    it('it should login with valid user and invalid password', async () => {
      users.username = process.env.USERS
      users.password = '123'
      assert.typeOf(users.username, 'string')
      assert.typeOf(users.password, 'string')
      const res = await methodSame(urls, 'post', users)
      expect(res.status).to.equal(401)
      expect(res.body).to.be.a('object')
    })
  })

  describe('/POST Login user', () => {
    it('it should login with valid data tipe', async () => {
      users.username = 43
      users.password = 123
      const res = await methodSame(urls, 'post', users)
      expect(res.status).to.equal(422)
      expect(res.body).to.be.a('object')
    })
  })
})
