
const { clientConfig } = require('../../config/redis')

const setCacheRedis = (key, data, expireTime, callback) => {
  try {
    clientConfig.get(key, (err, result) => {
      if(result){
        const resultJSON = JSON.parse(result)
        callback(null, resultJSON)
      }else{
        clientConfig.setex(key, expireTime, JSON.stringify(data)) // set redis key
        callback(null, data)
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

module.exports = {
  setCacheRedis
}