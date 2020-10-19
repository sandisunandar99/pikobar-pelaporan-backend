const { isTemplateVerified } = require('./helper')

const extractSheetToJson = async (request) => {
    const dir = './upload/'
    const conf = require('./config.json')
    const caseSheet = require('./getters/index')
    const xlsx = require('node-xlsx')

    //  genretae unique import batch id (debug purpose)
    const uniqueBatchId = require('uuid').v4()

    const uploaded = await handleFileUpload(request.payload.file)

    let dataSheet = (await xlsx.parse(dir + uploaded.filename))[0]['data']

    const version = `VERSION ${conf.version}`
    if (!isTemplateVerified(dataSheet)) {
      return conf.unverified_template
    }

    if (dataSheet[0][34] !== version) {
      return conf.version_out_of_date
    }

    dataSheet.splice(0, conf.start_row)
    let payload = []

    for (i in dataSheet)
    {
      const d = dataSheet[i]

      if (!caseSheet.isRowFilled(d)) continue;

      let obj = caseSheet.getBuiltCreateCasePayload(d, uniqueBatchId)

      for (var key in obj) {
        if(obj[key] && obj[key].trim) {
          obj[key] = obj[key].trim()
        }
      }

      payload.push(obj)
    }

    handleFileUnlink(dir + uploaded.filename)
    return payload
}

const isDistrictCodeValid = async (code) => {

    const mongoose = require('mongoose')
    const DistrictCity = mongoose.model('Districtcity')
    const district = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code})

    return !!district
}

const handleFileUpload = file => {
  const fs = require('fs')
  const dir = './upload/'

  return new Promise((resolve, reject) => {
    var filename = new Date().getTime() + '_' + file.hapi.filename.replace(' ', '')
    const data = file._data

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    fs.writeFile(dir + filename, data, err => {
      if (err) {
        return callback(err, null)
      }
      resolve({ filename: filename })
    })
  })
}

const handleFileUnlink = file => {
  const fs = require('fs')
  return fs.unlink(file, (err) => {
      if (err) {
        console.error(err)
        return
      }
  })
}

module.exports = {
  extractSheetToJson,
  isDistrictCodeValid,
}
