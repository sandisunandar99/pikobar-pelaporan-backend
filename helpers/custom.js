const setPwd = (password) => {
    const crypto = require('crypto');
    const salts = crypto.randomBytes(16).toString('hex')
    const hashing = crypto.pbkdf2Sync(password, salts, 10000, 512, 'sha512').toString('hex')
    return hashing
}

const jsonParse = (str) => {
    try {
        return JSON.parse(str)
    } catch (e) {
        return false
    }
}

module.exports = {
    setPwd, jsonParse
}