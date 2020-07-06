'use strict';
const CasesRevamp = require('../models/Case');
const HistoryRevamp = require('../models/History');
const CloseContact = require('../models/CloseContact');
const User =  require('../models/User');
const Notification = require('../models/Notification');
const Notif = require('../helpers/notification');
const Validate = require('../helpers/cases/revamp/handlerpost');
const Conf = require('../helpers/constant.json');

const createCaseRevamp = async (raw_payload, author, pre, callback) => {
  let verified = {
    'verified_status': Conf.VERIFIED_STATUS_VERIFIED,
  };

  if (author.role === Conf.ROLE_2) {
    verified.verified_status = Conf.VERIFIED_STATUS_PENDING;
  };

  const id_case = Validate.generateIdCase(author, pre);

  //TODO: check is verified is not overwritten ?
  let insert_id_case = Object.assign(raw_payload, verified);

  if (!insert_id_case.hasOwnProperty('id_case') || [null, ""].includes(insert_id_case['id_case'])) {
    insert_id_case = Object.assign(raw_payload, { id_case });
  }

  insert_id_case.author_district_code = author.code_district_city;
  insert_id_case.author_district_name = author.name_district_city;
  insert_id_case.fasyankes_type = author.role;
  insert_id_case.fasyankes_code = author._id;
  insert_id_case.fasyankes_name = author.fullname;
  insert_id_case.fasyankes_province_code = author.address_province_code;
  insert_id_case.fasyankes_province_name = author.address_province_name;
  insert_id_case.fasyankes_subdistrict_code = author.address_subdistrict_code;
  insert_id_case.fasyankes_subdistrict_name = author.address_subdistrict_name;
  insert_id_case.fasyankes_village_code = author.address_village_code;
  insert_id_case.fasyankes_village_name = author.address_village_name;

  let item = new CasesRevamp(Object.assign(insert_id_case, { author }));

  try {
    const saveCase = await item.save();
    const c = {'case': saveCase._id};

    raw_payload = Validate.validatePost(raw_payload);

    const history = new HistoryRevamp(Object.assign(raw_payload, c));
    const saveHistory =  await history.save();
    const last_history = {'last_history': saveHistory._id};
    const x = Object.assign(saveCase, last_history);
    const finalSave = await x.save();
    const mapingIdCase = raw_payload.close_contact_patient.map(r =>{
      r.case = saveCase._id;
      return r;
    })
    await CloseContact.create(mapingIdCase);
    await Notif.send(Notification, User, x, author, 'case-created');
    callback(null, finalSave);
  } catch (error) {
    callback(error, null);
  }
}

const checkIfExisting = async (query, callback) => {
  let check;
  if (query.params) {
    const gets = await CasesRevamp.find({
      $or: [{'nik': query.params }]
    });
    check = gets.length > 0;
  } else {
    check = 'parameter not set';
  }
  callback(null, check);
}

module.exports = [
  {
    name: 'services.cases_revamp.create',
    method: createCaseRevamp,
  },
  {
    name: "services.cases_revamp.checkIfExisting",
    method: checkIfExisting,
  },
];

