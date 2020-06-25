const setPwd = (password) => {
    const crypto = require('crypto');
    const salts = crypto.randomBytes(16).toString('hex')
    const hashing = crypto.pbkdf2Sync(password, salts, 10000, 512, 'sha512').toString('hex')
    return hashing
}

const deletedSave = (payloads, author) => {
    const date = new Date();
    payloads.delete_status = "deleted";
    payloads.deletedAt = date.toISOString();
    payloads.deletedBy = author;
    return payloads;
}

const isObject = (value) => {
    return value && typeof value === 'object' && value.constructor === Object
}

const deleteProps = (arrProps, obj) => {
    if (!isObject(obj) || !Array.isArray(arrProps)) return
    arrProps.map(x => delete obj[x])
}

const jsonParse = (str) => {
    try {
        return JSON.parse(str)
    } catch (e) {
        return false
    }
}

module.exports = {
    setPwd, deletedSave, isObject, deleteProps, jsonParse
}