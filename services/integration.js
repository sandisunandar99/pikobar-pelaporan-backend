const fs = require('fs')


const createInfoClinics = (payload) => {
  console.log("serviceeeeeeeeeeeeeeee");
  const data = JSON.parse(payload)
  console.log(data.user.nik);

}



module.exports = [
  {
    name: 'services.integration.createInfoClinics',
    method: createInfoClinics
  }
]