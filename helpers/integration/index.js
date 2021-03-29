const { object } = require('joi')
const {} = require('mongoose')
const Case = require('../../models/Case')
const History = require('../../models/History')
const LogSelfReport = require('../../models/LogSelfReport')
const {splitPayload1, splitPayload2, splitPayload3,
        splitCasePayload } = require('./splitpayload')
const {PUBSUB} = require('../constant')

const findUserCases = async(data) => {
  const user = data.user
  let filter = {}
  if (user.nik === "" || user.nik === null || user.nik === undefined){
    filter = {phone_number: user.phone_number}
  }else{
    filter = {nik: user.nik}
  }

  const cases = await Case.aggregate([
    { $match : filter },
    { $lookup :{from: "histories", localField: 'last_history', foreignField: '_id', as: 'histories' }},
    { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$histories", 0 ] }, "$$ROOT" ] } }},
    { $project : {histories: 0}},
    { $limit: (1)}
  ])
  return (cases.length > 0 ? cases : null)
}

const statusPikobar = (status)=> {
  let nameStatus = ""
  switch (status) {
    case "OTG":
      nameStatus = PUBSUB.OTG
      break;
    case "CONFIRMED":
      nameStatus = PUBSUB.CONFIRMED
      break;
    case "PDP":
      nameStatus = PUBSUB.PDP
      break;
    case "ODP":
      nameStatus = PUBSUB.ODP
      break;
    default:
      nameStatus = undefined
      break;
  }
  return nameStatus
}

const changePayloadLaporMandri = (data) => {
  const date = new Date()
  data.last_date_status_patient = date.toISOString()

  const Obj = {
    last_date_status_patient: data.last_date_status_patient,
    diagnosis: data.symptoms,
  }
  return Obj
}

const userHasFound = async (data) =>{
  const date = new Date().toISOString()
  try {
     const check  = await LogSelfReport.findOne({nik: data.user.nik}).or({phone_number: data.user.phone_number})

    if (check.user_has_found === null) {
      await LogSelfReport.updateOne(
        {$or: [{nik: data.user.nik}, {phone_number: data.user.phone_number}]},
        {$set: {user_has_found: date}}
      )
    }
  } catch (error) {
    return error
  }

  return null
}

const ifActionEdit = async (data, patient, transform) =>{
  const ENUM_ACTION_EDIT = "edit"
  if (data.action === ENUM_ACTION_EDIT) {
    await History.findByIdAndUpdate(patient.last_history,
      { $set: transform },
      { new: true },
    )
    return true
  } else {
    return false
  }

}

const transformDataPayload = (data, patient) => {
  userHasFound(data)

  const transform = {
    ...changePayloadLaporMandri(data),
    ...splitPayload1(patient),
    ...splitPayload2(patient),
    ...splitPayload3(patient)
  }

  ifActionEdit(data, patient, transform)

  return transform
}

const splitCodeAddr = (data) => {
  let address_district_code = "32.00"
  if (data.address_district_code) {
    let split_district = (data.address_district_code).toString()
    address_district_code = (split_district.substring(0,2)).concat(".",split_district.substring(2,4))
  }

  let address_subdistrict_code = "32.00.00"
  if (data.address_subdistrict_code) {
    let split_subdistrict = (data.address_subdistrict_code).toString()
    address_subdistrict_code = (split_subdistrict.substring(0,2)).concat(".",split_subdistrict.substring(2,4),".",split_subdistrict.substring(4,7))
  }

  let address_village_code = "32.00.00.0000"
  if (data.address_village_code) {
    let split_village = (data.address_village_code).toString()
    address_village_code = (split_village.substring(0,2)).concat(".",split_village.substring(2,4),".",split_village.substring(4,6),".",split_village.substring(6,11))
  }

  const code = {
    address_district_code: address_district_code,
    address_subdistrict_code: address_subdistrict_code,
    address_village_code: address_village_code,
  }

  data = Object.assign(data, code)
  return data
}

const transformDataCase = (data) => {
  splitCasePayload(data)
}

module.exports = {
  findUserCases, transformDataPayload, splitCodeAddr, transformDataCase
}