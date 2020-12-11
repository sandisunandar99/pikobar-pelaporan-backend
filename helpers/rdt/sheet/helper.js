const sheet = {
  ...require('./sheet')
}

const createPayload = (data, uniqueBatchId) =>{
  return {
    ...createRdt(data),
    source_data: `import-rdt-${uniqueBatchId}`
  }
}

const createRdt = (data) =>{
  return {
    no: sheet.getNum(data)
  }
}


module.exports ={
  createPayload
}