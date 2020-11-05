const json2xls = require('json2xls')
const moment = require('moment')
const fs = require('fs')

const generateExcell = async (data, title, fullName, reply) => {
  const jsonXls = json2xls(data);
  const fileName = `${title}-${fullName}-${moment().format("YYYY-MM-DD-HH-mm")}.xlsx`
  fs.writeFileSync(fileName, jsonXls, 'binary');
  const xlsx = fs.readFileSync(fileName)
  reply(xlsx)
    .header('Content-Disposition', 'attachment; filename=' + fileName);
  return fs.unlinkSync(fileName)
}

module.exports = {
  generateExcell
}