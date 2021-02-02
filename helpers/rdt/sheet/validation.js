const Joi = require('joi')
const rules = require('../../../api/rdt/validations/input')
const {transformedErrorResponse, transformedJoiErrors} = require('../../cases/sheet/validator')

const validation = async(payload) => {
  const errors ={}

  payload.forEach((value, i) => {
    const joiResult = Joi.validate(value, rules.RdtsheetRequest)

    const savedError = []
    let recordError = transformedJoiErrors(joiResult)

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

module.exports = {
  validation
}