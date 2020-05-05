require('../models/Case');
const Mongoose = require('mongoose');
const Helpers = require('../helpers/dashboardbottom');
const Case = Mongoose.model('Case');
const Sql = require('../helpers/sectionnumber');

const countByGenderAge = async (query, user, callback) => {
  try {
    const conditionAge = await Sql.conditionAge(user, query);
    const conditionGender = await Sql.conditionGender(user, query);
    const ageGroup = await Case.aggregate(conditionAge);
    const genderGroup = await Case.aggregate(conditionGender);
    const results = await Helpers.filterJson(ageGroup, genderGroup);
    
    callback(null,results);
  } catch (error) {
    callback(error, null);
  }
};


const countByOdp = async (query, user, callback) => {
  try {
    const queryODP = await Sql.sqlCondition(user, query, "ODP");
    const result = await Case.aggregate(queryODP);
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

const countByPdp = async (query, user, callback) => {
  try {
    const queryODP = await Sql.sqlCondition(user, query, "PDP");
    const result = await Case.aggregate(queryODP);
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}


const countByOtg = async (query, user, callback) => {
  try {
    const queryOtg = await Sql.sqlCondition(user, query, "OTG");
    const result = await Case.aggregate(queryOtg);
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

const countByConfirm = async (query, user, callback) => {
  const search = Check.countByRole(user);
  const filter = await Filter.filterCase(user, query);
  const searching = Object.assign(search, filter);

  try {
    const queryConfirm = [
      {
          $match: {
              $and: [
                  searching,
                  {"delete_status": {"$ne": "deleted"}},
                  {"status": "POSITIF"}
              ]
          }
      },
      {
          $project: {
              createdAt: {$dateToString: { 
                  format: "%Y/%m/%d",
                  date: "$createdAt" 
              }},
              final_result: 1
          }
      },
      {
          $group: { 
              _id: {createdAt: "$createdAt"},
              positif : {$sum: {$cond: { if: { $eq: ["$final_result",[null,"",0]] }, then: 1, else: 0 }}},
              sembuh : {$sum: {$cond: { if: { $eq: ["$final_result",'1'] }, then: 1, else: 0 }}},
              meninggal : {$sum: {$cond: { if: { $eq: ["$final_result",'2'] }, then: 1, else: 0 }}}
          }
      },
      {
          $sort: {
              "_id.createdAt": 1
          }
      },
      {
          $project: {
              _id: 0,
              date: "$_id.createdAt",
              positif: 1,
              sembuh: 1,
              meninggal: 1,
              total: 1
          }
      }
    ]

    const result = await Case.aggregate(queryConfirm);
  
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}


module.exports = [
  {
    name: "services.dashboard.countByGenderAge",
    method: countByGenderAge
  },
  {
    name: "services.dashboard.countByOdp",
    method: countByOdp
  },
  {
    name: "services.dashboard.countByPdp",
    method: countByPdp
  },
  {
    name: "services.dashboard.countByOtg",
    method: countByOtg
  },
  {
    name: "services.dashboard.countByConfirm",
    method: countByConfirm
  },
]