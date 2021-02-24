const {findUserCases, transformDataPayload} = require('../helpers/integration')

const createInfoClinics = async (payload) => {
  const data = JSON.parse(payload)
  try {
    //check data by nik or phone number
    const patient = await findUserCases(data)
    // transform payload with last data case patient
    const transData = await transformDataPayload(data, ...patient)

    return transData
  } catch (error) {
    return error
  }

}



module.exports = [
  {
    name: 'services.integration.createInfoClinics',
    method: createInfoClinics
  }
]