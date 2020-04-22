const setPwd = (password) => {
    const crypto = require('crypto');
    const salts = crypto.randomBytes(16).toString('hex')
    const hashing = crypto.pbkdf2Sync(password, salts, 10000, 512, 'sha512').toString('hex')
    return hashing
}

module.exports = {
    setPwd
}