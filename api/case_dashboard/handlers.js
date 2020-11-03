const { requestIfSame } = require('../../helpers/request')
const replyHelper = require('../helpers')
const json2xls = require('json2xls')
const moment = require('moment')
const fs = require('fs')
const { ROLE } = require('../../helpers/constant')

const countSectionTop = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "case_dashboard", "countSectionTop",
      request, reply
    )
  }
}

const countSummary = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "case_dashboard", "countSummary",
      request, reply
    )
  }
}

const countVisualization = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "case_dashboard", "countVisualization",
      request, reply
    )
  }
}

const exportDemographic = (server) => {
  return async (request, reply) => {
    let query = request.query
    const fullName = request.auth.credentials.user.fullname.replace(/\s/g, '-')
    const role = request.auth.credentials.user.role
    server.methods.services.case_dashboard.countSummary(
      query,
      request.auth.credentials.user,
      (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        const jsonXls = json2xls(mapingDemographic(result[0].demographic, role));
        const fileName = `Rekap-Data-Demogafis-${fullName}-${moment().format("YYYY-MM-DD-HH-mm")}.xlsx`
        fs.writeFileSync(fileName, jsonXls, 'binary');
        const xlsx = fs.readFileSync(fileName)
        reply(xlsx)
          .header('Content-Disposition', 'attachment; filename=' + fileName);
        return fs.unlinkSync(fileName);
      })
  }
}

const mapingDemographic = (result, role) => {
  let labels
  if([ROLE.ADMIN, ROLE.PROVINCE].includes(role)){
    labels = "Kota/Kab"
  }else{
    labels = "Kecamatan/Kelurahan"
  }
  return result.map(({ _id,
      wni, wna, male, female,under_five,
      six_nine, twenty_twenty_nine, thirty_thirty_nine
    }) => (
      {
        [labels]: _id, 'WNI': wni, 'WNA': wna,
        'Laki-Laki': male, 'Perempuan': female,
        '<5TH': under_five, '6-9TH': six_nine,
        '20-29TH': twenty_twenty_nine, '30-39TH': thirty_thirty_nine,
      }
    ))
}

module.exports = {
  countSectionTop, countSummary,
  countVisualization, exportDemographic
}