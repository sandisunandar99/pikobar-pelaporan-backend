require('dotenv').config()

const chai = require('chai')
const chaiHttp = require('chai-http')

chai.should()
chai.use(chaiHttp)

const methodSame = (urls, bodyParam, methods, code, done) => {
  chai.request(process.env.URLS)[methods](urls)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(bodyParam)
    .then((res) => {
      res.status.should.be.equal(code)
      res.body.should.be.a('object')
      done()
    })
    .catch((err) => {
      throw err
    })
}

module.exports = {
  methodSame
}