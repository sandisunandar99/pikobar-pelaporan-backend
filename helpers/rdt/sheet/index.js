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
      let x = await createPayload(data, uniqueBatchId)

      Object.keys(x).map(k => {
        if (x[k] && x[k].trim) {
          x[k] = x[k].trim()
        }
      })

      payload.push(x)
    }

    handleFileUnlink(dir + uploaded.filename)
    return payload
}

module.exports ={
  extractToJson
}