'use strict'
const { PATIENT_STATUS } = require('./constant')
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
  return value && typeof value === 'object'
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

const convertDate = (dates) => {
  return new Date(dates.getTime()).toLocaleDateString("id-ID");
}

const isDirty = (oldData, newData) => {
  if (!oldData) {
    return true
  }

  function isEqual(a, b) {
    if (Array.isArray(a))
      return JSON.stringify(a) === JSON.stringify(b)
    else if (typeof (a) === 'object')
      return String(a) === String(b)
    return a === b
  }

  let result = false
  let changed_props = [];
  for (let prop in newData) {
    if (typeof oldData[prop] === 'undefined') continue
    if (!isEqual(oldData[prop], newData[prop])) {
      result = true
      changed_props.push(prop)
    }
  }

  return result
}

const patientStatus = (res) => {
  let finalResult
  if (res.final_result === "1") {
    finalResult = PATIENT_STATUS.DONE
  } else if (res.final_result === "2") {
    finalResult = PATIENT_STATUS.DEAD
  } else if (res.final_result === "3") {
    finalResult = PATIENT_STATUS.DISCARDED
  } else if (res.final_result === "4") {
    finalResult = PATIENT_STATUS.SICK
  } else if (res.final_result === "5") {
    finalResult = PATIENT_STATUS.QUARANTINED
  } else {
    finalResult = PATIENT_STATUS.NEGATIVE
  }

  return finalResult
}

module.exports = {
  setPwd, deletedSave, isObject, deleteProps, jsonParse,
  convertDate, isDirty, patientStatus
}
