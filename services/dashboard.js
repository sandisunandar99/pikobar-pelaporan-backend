require('../models/Case');
const Mongoose = require('mongoose');
const Helpers = require('../helpers/dashboardbottom');
const Case = Mongoose.model('Case');
const Check = require('../helpers/rolecheck');
const Filter = require('../helpers/casefilter');

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


const countByODP = async (query, user, callback) => {
  const search = Check.countByRole(user);
  const filter = await Filter.filterCase(user, query);
  const searching = Object.assign(search, filter);

  try {
    const queryODP = [
      {
          $match: {
              $and: [
                  searching,
                  {"delete_status": {"$ne": "deleted"}},
                  {"status": "ODP"}
              ]
          }
      },
      {
          $project: {
              createdAt: {$dateToString: { 
                  format: "%m/%d", 
                  date: "$createdAt" 
              }},
              stage: 1
          }
      },
      {
          $group: { 
              _id: {createdAt: "$createdAt"},
              proses : {$sum: {$cond: { if: { $eq: ["$stage",'0'] }, then: 1, else: 0 }}},
              selesai : {$sum: {$cond: { if: { $eq: ["$stage",'1'] }, then: 1, else: 0 }}},
              total : {$sum: 1}
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
              proses: 1,
              selesai: 1,
              total: 1
          }
      }
    ]

    const result = await Case.aggregate(queryODP);

    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}


const countByPDP = async (query, user, callback) => {
  const search = Check.countByRole(user);
  const filter = await Filter.filterCase(user, query);
  const searching = Object.assign(search, filter);

  try {
    const queryODP = [
      {
          $match: {
              $and: [
                  searching,
                  {"delete_status": {"$ne": "deleted"}},
                  {"status": "PDP"}
              ]
          }
      },
      {
          $project: {
              createdAt: {$dateToString: { 
                  format: "%m/%d", 
                  date: "$createdAt" 
              }},
              stage: 1
          }
      },
      {
          $group: { 
              _id: {createdAt: "$createdAt"},
              proses : {$sum: {$cond: { if: { $eq: ["$stage",'0'] }, then: 1, else: 0 }}},
              selesai : {$sum: {$cond: { if: { $eq: ["$stage",'1'] }, then: 1, else: 0 }}},
              total : {$sum: 1}
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
              proses: 1,
              selesai: 1,
              total: 1
          }
      }
    ]

    const result = await Case.aggregate(queryODP);
  
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}


const countByOTG = async (query, user, callback) => {
  const search = Check.countByRole(user);
  const filter = await Filter.filterCase(user, query);
  const searching = Object.assign(search, filter);

  try {
    const queryODP = [
      {
          $match: {
              $and: [
                  searching,
                  {"delete_status": {"$ne": "deleted"}},
                  {"status": "OTG"}
              ]
          }
      },
      {
          $project: {
              createdAt: {$dateToString: { 
                  format: "%m/%d", 
                  date: "$createdAt" 
              }},
              stage: 1
          }
      },
      {
          $group: { 
              _id: {createdAt: "$createdAt"},
              proses : {$sum: {$cond: { if: { $eq: ["$stage",'0'] }, then: 1, else: 0 }}},
              selesai : {$sum: {$cond: { if: { $eq: ["$stage",'1'] }, then: 1, else: 0 }}},
              total : {$sum: 1}
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
              proses: 1,
              selesai: 1,
              total: 1
          }
      }
    ]

    const result = await Case.aggregate(queryODP);
  
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
    name: "services.dashboard.countByODP",
    method: countByODP
  },
  {
    name: "services.dashboard.countByPDP",
    method: countByPDP
  },
  {
    name: "services.dashboard.countByOTG",
    method: countByOTG
  },
]