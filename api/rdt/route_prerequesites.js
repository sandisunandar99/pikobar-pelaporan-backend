const replyHelper = require('../helpers')

const validationBeforeInput = server => {
  return {
    method: (request, reply) => {
      const payloadDistrict = request.payload.address_district_code
      const userDistrict = request.auth.credentials.user.code_district_city
      const message = 'Anda tidak dapat melakukan input test di luar wilayah anda.!'
      if (payloadDistrict === userDistrict) {
        return reply(userDistrict)
      } else {
        return reply(replyHelper.responseRdt(403, message, null)).code(403).takeover()
      }
    },
    assign: 'validation_before_input'
  }
}

const countRdtCode = server => {
  return {
    method: (request, reply) => {
      const districtCode = request.payload.address_district_code
      methodOneParam(server, 'getCountRdtCode', districtCode, reply)
    },
    assign: 'count_rdt'
  }
}

const countCaseByDistrict = server => {
  return {
    method: (request, reply) => {
      server.methods.services.rdt.getCountByDistrict(
        request.payload.address_district_code,
        (err, count) => {
          if (err) {
            return reply(replyHelper.constructErrorResponse(err)).takeover()
          }
          return reply(count)
        })
    },
    assign: 'count_case'
  }
}

const getRdtbyId = server => {
  return {
    method: (request, reply) => {
      methodOneParam(server, 'getById', request.params.id, reply)
    },
    assign: 'rdt'
  }
}

const getCasebyIdcase = server => {
  return {
    method: (request, reply) => {
      let idcase = request.pre.rdt.id_case
      server.methods.services.rdt.getCaseByidcase(
        idcase,
        (err, item) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(item)
        })
    },
    assign: 'cases'
  }
}

const getCodeDinkes = server => {
  return {
    method: (request, reply) => {
      let code = request.payload.address_district_code
      methodOneParam(server, 'getCodeDinkes', code, reply)
    },
    assign: 'code_dinkes'
  }
}

const checkIfDataNotNull = server => {
  return {
    method: (request, reply) => {
      let fullname = user.fullname
      let query = request.query
      let message = `Data untuk ${fullname} belum ada.`
      let user = request.auth.credentials.user

      server.methods.services.rdt.list(
        query,
        user,
        (err, result) => {
          if (result !== null) {
            if (result.rdt.length === 0) {
              return reply(replyHelper.responseRdt(200, message, null)).code(200).takeover()
            } else {
              return reply()
            }
          } else {
            return reply(replyHelper.responseRdt(200, message, null)).code(200).takeover()
          }
        })
    },
    assign: 'check_rdt'
  }
}

const getDataExternal = server => {
  return {
    method: (request, reply) => {
      sameMethod(server, 'getDatafromExternal', request, reply)
    },
    assign: 'data_pendaftaran'
  }
}

const searchIdcasefromExternal = server => {
  return {
    method: (request, reply) => {
      sameMethod(server, 'seacrhFromExternal', request, reply)
    },
    assign: 'search_external'
  }
}

const searchIdcasefromInternal = server => {
  return {
    method: (request, reply) => {
      methodOneParam(server, 'seacrhFromInternal', request.query, reply)
    },
    assign: 'search_internal'
  }
}

const getRegisteredUserfromExternal = server => {
  return {
    method: (request, reply) => {
      methodOneParam(server, 'getRegisteredFromExternal', request.query, reply)
    },
    assign: 'reg_user_external'
  }
}

const cekHistoryCases = server => {
  return {
    method: (request, reply) => {
      const payloads = {
        final_result: null,
        status: "POSITIF",
        id_case: request.payload.id_case
      }
      sameCondition(server, 'checkHistoryCasesBeforeInputTest', payloads, request, reply)
    },
    assign: 'cek_history_case'
  }
}


const createHistoryWhenPositif = server => {
  return {
    method: (request, reply) => {
      const payloads = request.pre.cek_history_case
      sameCondition(server, 'createHistoryFromInputTest', payloads, request, reply)
    },
    assign: 'create_history_when_positif'
  }
}

const sameMethod = (server, name, request, reply) => {
  return server.methods.services.rdt[name](
    request.query.address_district_code,
    request.query.search,
    (err, item) => {
      if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
      return reply(item)
    })
}

const methodOneParam = (server, name, param, reply) => {
  return server.methods.services.rdt[name](param, (err, item) => {
    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
    return reply(item)
  })
}

const sameCondition = (server, name, payloads, request, reply) => {
  const source_data = request.payload.source_data
  const tool_tester = request.payload.tool_tester
  const final_result = request.payload.final_result
  if (source_data === "internal" && tool_tester === "PCR" && final_result === "POSITIF") {
    server.methods.services.histories[name](
      payloads,
      (err, item) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(item)
      })
  } else {
    return reply()
  }
}

module.exports = {
  countRdtCode,
  getRdtbyId,
  getCasebyIdcase,
  getCodeDinkes,
  countCaseByDistrict,
  checkIfDataNotNull,
  getDataExternal,
  searchIdcasefromInternal,
  searchIdcasefromExternal,
  validationBeforeInput,
  getRegisteredUserfromExternal,
  cekHistoryCases,
  createHistoryWhenPositif
}
