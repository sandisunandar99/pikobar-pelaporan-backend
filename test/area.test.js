require('dotenv').config()
process.env.NODE_ENV = 'test'
const urls = `/country`
const { methodSame, getToken } = require('./index')
const chai = require("chai")
const expect = chai.expect

describe('Areas Functional Test', () => {

  describe('/Get List Country', () => {
    it('it should get list country no auth or expired token', async () => {
      const res = await methodSame(urls, 'get', [])
      expect(res.status).to.equal(401)
      expect(res.body).to.be.a('object')
    })
  })

  describe('/Get List Country', () => {
    it('it should get list country with auth bearer', async () => {
      const token = await getToken()
      const res = await methodSame(urls, 'get', [], token)
      expect(res.status).to.equal(200)
      expect(res.body).to.be.a('object')
    })
  })

})
