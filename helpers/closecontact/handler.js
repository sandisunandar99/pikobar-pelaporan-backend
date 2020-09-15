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
      close_contact_phone: v.phone_number,
      close_contact_birth_date: v.birth_date,
      close_contact_age: v.age,
      close_contact_gender: v.gender,
      close_contact_address_street: v.address_street,
      close_contact_relation: v.relationship,
      close_contact_activity: v.activity_other,
      close_contact_first_date: new Date(),
      close_contact_last_date: new Date(),
    }
  }
}

module.exports = {
  appendParent,
  premierContactPayload,
}
