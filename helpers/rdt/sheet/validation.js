const Joi = require('joi')
const rules = require('../../../api/rdt/validations/input')
const lang =require('../../dictionary/id.json')
const {transformedErrorResponse, translateLangId} = require('../../cases/sheet/validator')

const validation = async(payload) => {
  const errors ={}

  payload.forEach((value, i) => {
    const joiResult = Joi.validate(value, rules.RdtsheetRequest)

    const savedError = []
    let recordError = joiErrors(joiResult)

    if(Object.keys(recordError).length){
      savedError.push(recordError)
    }

    if (savedError.length) {
      const r = (parseInt(i)+1).toString()
      errors[r] = savedError
    }
  });

  return transformedErrorResponse(errors)
}

const joiErrors = (joiResult) => {
  if(!joiResult.error) return {}

  let transformedErrors = {}
  const details = joiResult.error.details

  for(let err in details){
    let errMsg = details[err].message

    let errField = errMsg.substr(
      1, errMsg.lastIndexOf('"')-1
    )

    // transform field to idn locale lang
    transformedErrors = translateLangId(
      transformedErrors,
      errField,
      errMsg
    )
  }
  return transformedErrors
}


module.exports = {
  validation
}