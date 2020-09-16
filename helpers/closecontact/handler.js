const appendParent = async (schema, req, cases) => {
  const rules = req.id_case
    ? { id_case: req.id_case }
    : { nik: req.nik }

  return await schema.findOneAndUpdate(rules, {
    $addToSet: premierContactPayload(cases)
  })
}

const premierContactPayload = (v) => {
  return {
    close_contact_premier: {
      is_west_java: true,
      close_contact_id_case: v.id_case,
      close_contact_criteria: v.status,
      close_contact_name: v.name,
      close_contact_nik: v.nik,
      close_contact_phone_numbers: v.phone_number,
      close_contact_birth_date: v.birth_date,
      close_contact_occupation: v.occupation,
      close_contact_gender: v.gender,
      close_contact_address_street: v.address_street,
      close_contact_address_district_code: v.address_district_code,
      close_contact_address_district_name: v.address_district_name,
      close_contact_address_subdistrict_code: v.address_subdistrict_code,
      close_contact_address_subdistrict_name: v.address_subdistrict_name,
      close_contact_address_village_code: v.address_village_code,
      close_contact_address_village_name: v.address_village_name,
      close_contact_rt: v.rt,
      close_contact_rw: v.rw,
      close_contact_relation: null,
      close_contact_relation_others: null,
      close_contact_activity: null,
      close_contact_activity_others: null,
      close_contact_first_date: null,
      close_contact_last_date: null,
    }
  }
}

module.exports = {
  appendParent,
  premierContactPayload,
}
