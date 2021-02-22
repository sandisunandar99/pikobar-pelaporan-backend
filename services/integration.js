const createInfoClinics = (payload) => {
  console.log("serviceeeeeeeeeeeeeeee");
  const data = JSON.parse(payload)
  console.log(data);

}



module.exports = [
  {
    name: 'services.integration.createInfoClinics',
    method: createInfoClinics
  }
]