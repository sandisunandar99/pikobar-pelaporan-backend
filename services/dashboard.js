require('../models/Case');
const mongoose = require('mongoose');
const Case = mongoose.model('Case');
const Check = require('../helpers/rolecheck');

const countByGender = async (query, user, callback) => {
  let searching = Check.countByRole(user);

  if (query.address_village_code) {
    searching.address_village_code = query.address_village_code;
  }

  if (query.address_subdistrict_code) {
    searching.address_subdistrict_code = query.address_subdistrict_code;
  }

  if (user.role == "dinkesprov" || user.role == "superadmin") {
    if (query.address_district_code) {
      searching.address_district_code = query.address_district_code;
    }
  }

  const searchingMan = {gender: "L"};
  const searchingWoman = {gender: "P"};

  console.log(searching);
  

  try {
    const man = await Case.find(Object.assign(searching, searchingMan))
    .where("delete_status").ne("deleted").then(res => { return res.length });
    const woman = await Case.find(Object.assign(searching, searchingWoman))
    .where("delete_status").ne("deleted").then(res => { return res.length });
    const result = {
      "MAN": man,
      "WOMAN": woman,
    }
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
};

const countByAge = (callback) => {

}

module.exports = [{
  name: "services.dashboard.countByGender",
  method: countByGender
}]