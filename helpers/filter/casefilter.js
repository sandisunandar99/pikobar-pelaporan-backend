const filterCase = async (user, query) => {
  const params = {};
  // only provide when needed
  if (query.author_district_code) {
    params.author_district_code = query.author_district_code;
  }
  if (user.role == "dinkesprov" || user.role == "superadmin") {
    if (query.address_district_code) {
      params.address_district_code = query.address_district_code;
    }
  }
  if (query.address_village_code) {
    params.address_village_code = query.address_village_code;
  }
  if (query.address_subdistrict_code) {
    params.address_subdistrict_code = query.address_subdistrict_code;
  }
  if (query.verified_status && query.verified_status.split) {
    params.verified_status = { $in: query.verified_status.split(',') }
  }
  if (query.status) { params.status = query.status }
  if (query.final_result) { params.final_result = query.final_result }
  if (query.tool_tester) { params.tool_tester = query.tool_tester }
  if (query.criteria) { params.status = query.criteria }
  return params;
}

const filterRdt = (user, query) => {
  const params = {}
  if (user.role == "dinkesprov" || user.role == "superadmin") {
    if (query.address_district_code) params.address_district_code = query.address_district_code
  }
  if (query.address_village_code) params.address_village_code = query.address_village_code
  if (query.address_subdistrict_code) params.address_subdistrict_code = query.address_subdistrict_code
  if(query.category) params.category = query.category
  if(query.final_result) params.final_result = query.final_result
  if(query.mechanism) params.mechanism = query.mechanism
  if(query.test_method) params.test_method = query.test_method
  if(query.tool_tester) params.tool_tester = query.tool_tester
  if(query.test_address_district_code) params.test_address_district_code = query.test_address_district_code
  if(query.start_date && query.end_date){
    params.test_date = {
      "$gte": new Date(new Date(query.start_date)).setHours(00, 00, 00),
      "$lt": new Date(new Date(query.end_date)).setHours(23, 59, 59)
    }
  }
  return params
}

module.exports = {
  filterCase,
  filterRdt
}