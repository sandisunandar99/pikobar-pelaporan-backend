const {findUserCases} = require('../helpers/integration')

const createInfoClinics = async (payload) => {
  const data = JSON.parse(payload)

  //check data by nik or phone number
  const patient = await findUserCases(data);
  console.log(patient);

}



module.exports = [
  {
    name: 'services.integration.createInfoClinics',
    method: createInfoClinics
  }
]