'use strict';
const setPwd = (payload) => {
    const crypto = require('crypto');
    payload.salt = crypto.randomBytes(16).toString('hex');
    payload.hash = crypto.pbkdf2Sync(payload.password, payload.salt, 10000, 512, 'sha512').toString('hex');
    payload.password = payload.hash;
    return payload;
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

module.exports = {
    setPwd, deletedSave, isObject, deleteProps
}