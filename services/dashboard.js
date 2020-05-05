require('../models/Case');
const Mongoose = require('mongoose');
const Helpers = require('../helpers/dashboardbottom');
const Case = Mongoose.model('Case');
const Check = require('../helpers/rolecheck');
const Filter = require('../helpers/casefilter');
const Sql = require('../helpers/sectionnumber');

const countByGenderAge = async (query, user, callback) => {
  const search = Check.countByRole(user);
  const filter = await Filter.filterCase(user, query);
  const searching = Object.assign(search, filter);

  try {
    const conditionAge = [
      {$match: { 
        $and: [searching, {"delete_status": {"$ne": "deleted"}}, {"status":"POSITIF", "final_result" : { "$in": [null,"",0] }}]
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
        $and: [ searching, {"delete_status": {"$ne": "deleted"}}, {"status":"POSITIF", "final_result" : { "$in": [null,"",0] }}]
      }},
      { $group: { _id: "$gender", "total": { $sum: 1 }}}
    ];

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
    const queryODP = await Sql.sqlCondtion(user, query, "ODP");
    const result = await Case.aggregate(queryODP);
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

const countByPdp = async (query, user, callback) => {
  try {
    const queryODP = await Sql.sqlCondtion(user, query, "PDP");
    const result = await Case.aggregate(queryODP);
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}


const countByOtg = async (query, user, callback) => {
  try {
    const queryOtg = await Sql.sqlCondtion(user, query, "OTG");
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