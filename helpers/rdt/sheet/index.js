const dir = './upload/'
const xlsx = require('node-xlsx')
const config = require('../sheet/config.json')
const {createPayload} = require('./helper')
const {handleFileUpload, handleFileUnlink} = require('../../cases/sheet/handler')

const extractToJson = async (request) => {
    //  generate unique import batch id (debug purpose)
    const uniqueBatchId = require('uuid').v4()

    const uploaded = await handleFileUpload(request.payload.file)

    const dataSheet = (await xlsx.parse(dir + uploaded.filename))[0]['data']

    dataSheet.splice(0, config.start_row)

    let payload = []

    for (let i in dataSheet) {
      const data = dataSheet[i]
      let obj = await createPayload(data, uniqueBatchId)

      Object.keys(obj).map(k => {
        if (obj[k] && obj[k].trim) {
          obj[k] = obj[k].trim()
        }
      })

      payload.push(obj)
    }

    handleFileUnlink(dir + uploaded.filename)
    return payload
}

module.exports ={
  extractToJson
}