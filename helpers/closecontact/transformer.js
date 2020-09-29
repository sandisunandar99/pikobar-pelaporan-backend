const transformInspectionSupport = (lastHis) => {
  const inspects = []
  if (lastHis.test_nasopharyngeal_swab) {
    inspects.push({
      specimens_type: 'Swab Nasofaring',
      inspection_date: lastHis.test_nasopharyngeal_swab_date,
      inspection_location: null,
      get_specimens_to: null,
      inspection_result: lastHis.test_nasopharyngeal_swab_result,
      inspection_type: 'lab_cofirm',
    })
  }

  if (lastHis.test_orofaringeal_swab) {
    inspects.push({
      specimens_type: 'Swab Orofaring',
      inspection_date: lastHis.test_orofaringeal_swab_date,
      inspection_location: null,
      get_specimens_to: null,
      inspection_result: lastHis.test_orofaringeal_swab_result,
      inspection_type: 'lab_cofirm',
    })
  }

  if (lastHis.test_serum) {
    inspects.push({
      specimens_type: 'Serum',
      inspection_date: null,
      inspection_location: null,
      get_specimens_to: null,
      inspection_result: null,
      inspection_type: 'other_checks',
    })
  }

  return inspects
}

const transformTravelingHis = (thisCase) => {
  const travels = []

  if (thisCase.travel_is_went_abroad) {
    travels.push({
      travelling_type: "Dari Luar Negeri",
      travelling_visited: thisCase.travel_visited_country,
      travelling_city: null,
      travelling_date: thisCase.travel_country_depart_date,
      travelling_arrive: thisCase.travel_country_return_date,
    })
  }

  if (thisCase.travel_is_went_other_city) {
    travels.push({
      travelling_type: "Dari Luar Kota",
      travelling_visited: thisCase.travel_visited_city,
      travelling_city: thisCase.travel_visited_city,
      travelling_date: thisCase.travel_city_depart_date,
      travelling_arrive: thisCase.travel_city_depart_date,
    })
  }

  return travels
}

const transformClosecontact = (thisCase) => {
  const premierContacts = []

  if (thisCase.case) {
    premierContacts.push({
      is_west_java: true,
      close_contact_id_case: thisCase.case.id_case,
      close_contact_criteria: CRITERIA.CLOSE,
      close_contact_name: thisCase.case.name,
      close_contact_nik: thisCase.case.nik,
      close_contact_phone_numbers: thisCase.case.phone_number,
      close_contact_birth_date: thisCase.case.birth_date,
      close_contact_occupation: thisCase.case.occupation,
      close_contact_gender: thisCase.case.gender,
      close_contact_address_street: thisCase.case.address_street,
      close_contact_address_district_code: thisCase.case.address_district_code,
      close_contact_address_district_name: thisCase.case.address_district_name,
      close_contact_address_subdistrict_code: thisCase.address_subdistrict_code,
      close_contact_address_subdistrict_name: thisCase.address_subdistrict_name,
      close_contact_address_village_code: thisCase.address_village_code,
      close_contact_address_village_name: thisCase.address_village_name,
      close_contact_rt: thisCase.address_rt,
      close_contact_rw: thisCase.address_rw,
      close_contact_relation: thisCase.relationship,
      close_contact_relation_others: thisCase.relationship_other,
      close_contact_activity: thisCase.activity,
      close_contact_activity_others: thisCase.activity_other,
      close_contact_first_date: thisCase.start_contact_date,
      close_contact_last_date: thisCase.end_contact_date,
    })
  }

  return premierContacts
}

module.exports = {
  transformInspectionSupport,
  transformTravelingHis,
  transformClosecontact,
}
