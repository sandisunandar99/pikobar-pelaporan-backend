require('../models/Case');
const Mongoose = require('mongoose');
const Helpers = require('../helpers/dashboardbottom');
const Case = Mongoose.model('Case');
const Check = require('../helpers/rolecheck');
const Filter = require('../helpers/casefilter');

const countByGender = async (query, user, callback) => {
  const search = Check.countByRole(user);
  const filter = await Filter.filterCase(user, query);
  const searching = Object.assign(search,filter);

  try {
    const conditionAge = [
      {$match: { 
        $and: [searching, {delete_status: {$ne :'deleted' }}]
      }},
      {$bucket:
      {
        groupBy: "$age", 
        boundaries: [0,10,20,30,40,50,60,70,80,90,100], 
        default: "other", 
        output : {
          "total": {$sum: 1},
          "male" : {$sum : {$cond: { if: { $eq: [ "$gender", "L" ] }, then: 1, else: 0 }}},
          "female" : {$sum : {$cond: { if: { $eq: [ "$gender", "P" ] }, then: 1, else: 0 }}} }
        }
      }
    ];

    const conditionGender = [
      { $match: { 
        $and: [ searching, { delete_status: { $ne: 'deleted' }} ]
      }},
      { $group: { _id: "$gender", "total": { $sum: 1 }}}
    ];

    const ageGroup = await Case.aggregate(conditionAge);
    const genderGroup = await Case.aggregate(conditionGender);
    const results = await Helpers.filterJson(ageGroup,genderGroup);
    
    callback(null,results);
  } catch (error) {
    callback(error, null);
  }
};

module.exports = [{
  name: "services.dashboard.countByGender",
  method: countByGender
}]