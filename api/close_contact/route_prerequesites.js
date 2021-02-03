const { validateLocation, handlerErrorResult } = require('../../helpers/request')
const getCasebyId = server => {
  return {
    method: (request, reply) => {
      const { caseId } = request.params
      server.methods.services.cases.getById(caseId, (err, result) =>
        handlerErrorResult(err, result, 'Invalid case id', reply)
      )
    },
    assign: 'cases'
  }
}

const getCloseContactbyId = server => {
  return {
    method: (request, reply) => {
      let id = request.params.closeContactId
      server.methods.services.closeContacts.show(id, (err, result) =>
        handlerErrorResult(err, result, 'Invalid close contact id', reply)
      )
    },
    assign: 'close_contact'
  }
}

const districtInputScope = server => {
  const message = 'Anda tidak dapat melakukan input Kontak Erat di luar wilayah anda.!'
  return {
    method: (request, reply) => validateLocation(request, reply, message),
    assign: 'district_input_scope'
  }
}

module.exports = {
  getCasebyId,
  getCloseContactbyId,
  districtInputScope,
}
