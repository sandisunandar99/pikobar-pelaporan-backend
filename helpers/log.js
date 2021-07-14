const logInfo = (callback, name, result, key) => {
  callback(null, result)
  console.info(`${name} source ${key}`)
}

module.exports = {
  logInfo
}