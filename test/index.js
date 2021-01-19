require('dotenv').config()

const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

const users = {
  username: process.env.USERS,
  password: process.env.PASSWORD
}

const methodSame = async (urls, methods, bodyParam, token='') => {
  return chai.request(process.env.URLS)[methods](urls)
  .set('Accept', 'application/json')
  .set('Content-Type', 'application/json')
  .set({ "Authorization": `Bearer ${token}` })
  .send(bodyParam)
}

const getToken = async () => {
  const result = await chai.request(process.env.URLS).post('/login')
  .set('Accept', 'application/json')
  .set('Content-Type', 'application/json')
  .send(users)

  return result.body.data.token
}

module.exports = {
  methodSame, getToken
}