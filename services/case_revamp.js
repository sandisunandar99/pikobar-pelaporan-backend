'use strict';
const CasesRevamp = require('../models/Case');
const HistoryRevamp = require('../models/History');
const CloseContact = require('../models/CloseContact');
const User =  require('../models/User');
const Notification = require('../models/Notification');
const Notif = require('../helpers/notification');

const createCaseRevamp = async (raw_payload, author, pre, callback) => {
  let verified = {
    'verified_status': 'verified',
  };

  if (author.role === "faskes") {
    verified.verified_status = 'pending';
  };

  let date = new Date().getFullYear().toString();
  let id_case;

  if (author.role === 'faskes') {
    id_case = "precovid-";
    id_case += pre.count_case_pending.dinkes_code;
    id_case += date.substr(2, 2);
    id_case += "0".repeat(5 - pre.count_case_pending.count_pasien.toString().length);
    id_case += pre.count_case_pending.count_pasien;
  } else {
    id_case = "covid-";
    id_case += pre.count_case.dinkes_code;
    id_case += date.substr(2, 2);
    id_case += "0".repeat(4 - pre.count_case.count_pasien.toString().length);
    id_case += pre.count_case.count_pasien;
  }

  //TODO: check is verified is not overwritten ?
  let insert_id_case = Object.assign(raw_payload, verified);

  if (!insert_id_case.hasOwnProperty('id_case') || [null, ""].includes(insert_id_case['id_case'])) {
    insert_id_case = Object.assign(raw_payload, { id_case });
  }

  insert_id_case.author_district_code = author.code_district_city;
  insert_id_case.author_district_name = author.name_district_city;

  let item = new CasesRevamp(Object.assign(insert_id_case, { author }));

  try {
    const saveCase = await item.save();
    const c = {'case': saveCase._id};

    if (raw_payload.current_hospital_id == "") {
      raw_payload.current_hospital_id = null;
    }

    if (raw_payload.first_symptom_date == "") {
      raw_payload.first_symptom_date = Date.now();
    }

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

module.exports = [
  {
    name: 'services.cases_revamp.create',
    method: createCaseRevamp,
  },
];

