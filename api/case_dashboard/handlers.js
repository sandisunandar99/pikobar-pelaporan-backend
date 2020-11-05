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
      async (err, result) => {
        const dataDemographic = await mapingDemographic(result[0].demographic, role)
        const title = "Rekap-Data-Demografis"
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return await generateExcell(dataDemographic, title, fullName, reply)
      }
    )
  }
}

const exportCriteria = (server) => {
  return async (request, reply) => {
    const { fullname, role } = request.auth.credentials.user
    const fullName = fullname.replace(/\s/g, '-')
    const { criteriaConvert } = require("../../helpers/custom")
    const titleCriteria = criteriaConvert(request.query.criteria).replace(" ","-")
    server.methods.services.case_dashboard.countSummary(
      request.query,
      request.auth.credentials.user,
      async (err, result) => {
        const dataCriteria = await mapingCriteria(result[0].summary, role)
        const title = `Rekap-Data-${titleCriteria}-`
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return await generateExcell(dataCriteria, title, fullName, reply)
      },
    )
  }
}

const lableHeader = (role) => {
  let labels
  if([ROLE.ADMIN, ROLE.PROVINCE].includes(role)){
    labels = "Kota/Kab"
  }else{
    labels = "Kecamatan/Kelurahan"
  }

  return labels
}

const mapingDemographic = async (result, role) => {
  return result.map(({ _id,
      wni, wna, male, female,under_five,
      six_nine, twenty_twenty_nine, thirty_thirty_nine
    }) => (
      {
        [lableHeader(role)]: _id, 'WNI': wni, 'WNA': wna,
        'Laki-Laki': male, 'Perempuan': female,
        '<5TH': under_five, '6-9TH': six_nine,
        '20-29TH': twenty_twenty_nine, '30-39TH': thirty_thirty_nine,
      }
  ))
}

const mapingCriteria = async (result, role) => {

  return result.map(({ _id,
      active, sick_home, sick_hospital, recovered, decease,
    }) => (
      {
        [lableHeader(role)]: _id,
        'Total':active + sick_home + sick_hospital + recovered + decease,
        'Masih Sakit': active, 'Isolasi Mandiri': sick_home,
        'Isolasi Rumah Sakit': sick_hospital, 'Sembuh': recovered,
        'Meninggal': decease,
      }
  ))
}

const generateExcell = async (data, title, fullName, reply,) => {
  const jsonXls = json2xls(data);
  const fileName = `${title}-${fullName}-${moment().format("YYYY-MM-DD-HH-mm")}.xlsx`
  fs.writeFileSync(fileName, jsonXls, 'binary');
  const xlsx = fs.readFileSync(fileName)
  reply(xlsx)
    .header('Content-Disposition', 'attachment; filename=' + fileName);
  return fs.unlinkSync(fileName)
}

module.exports = {
  countSectionTop, countSummary,
  countVisualization, exportDemographic, exportCriteria
}