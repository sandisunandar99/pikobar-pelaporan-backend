const replyHelper = require('../helpers')
const { funcIfSame, funcCreate } = require('../../helpers/request')
const {
  replyJson
} = require('../helpers')
const json2xls = require('json2xls')
const moment = require('moment')
const fs = require('fs')

const ListHistory = (server) => {
  return async (_request, reply) => {
    server.methods.services.histories.list(
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const CreateHistory = (server) => {
  return async(request, reply) => {
    await funcCreate(server, "histories", "createIfChanged", request, reply)
  }
}

const GetHistoryDetail = (server) => {
   return async(request, reply) => {
    await funcIfSame(server, "histories", "getById", request, "id", reply)
  }
}

const DeleteHistory = (server) => {
  return (request, reply) => {
    server.methods.services.histories.deleteById(
      request.params.id,
      request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const UpdateHistory = (server) => {
  return async(request, reply) => {
    await funcCreate(server, "histories", "updateById", request, reply)
  }
}

const exportHistory = (server) => {
  return (request, reply) => {
    const fullName = request.auth.credentials.user.fullname.replace(/\s/g, '-')
    let {
      query
    } = request
    server.methods.services.histories.listHistoryExport(
      query, request.auth.credentials.user, (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        const jsonXls = json2xls(result);
        const fileName = `Data-Riwayat-Info-Klinis-${fullName}-${moment().format("YYYY-MM-DD-HH-mm")}.xlsx`
        fs.writeFileSync(fileName, jsonXls, 'binary');
        const xlsx = fs.readFileSync(fileName)
        reply(xlsx)
          .header('Content-Disposition', 'attachment; filename=' + fileName);
        return fs.unlinkSync(fileName);
      })
  }
}



module.exports = {
  ListHistory,
  CreateHistory,
  GetHistoryDetail,
  DeleteHistory,
  UpdateHistory,
  exportHistory
}