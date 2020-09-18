const Case = require('../models/Case')

const getCases = async (query, callback) => {
  let search = {}
  let params = {}
  params.verified_status = "verified"
  if(query.name){
    search.name = new RegExp(query.name, "i");
  }
  const select = [
    "id_case", "criteria", "name" ,"nik", "phone_numbers", "birth_date",
    "occupation", "gender", "address_street", "address_district_code",
    "address_district_name", "address_subdistrict_code", "address_subdistrict_name",
    "address_village_code", "address_village_name", "rt", "rw"
  ]
  try {
    const result = await Case.find(params).or(search).select(select)
    callback (null, result)
  } catch (error) {
    callback(error, null)
  }
}


module.exports = [
  {
    name: 'services.search.getCases',
    method: getCases
  }
]

