const Check = require('../helpers/rolecheck');
const Filter = require('../helpers/casefilter');

const conditionConfirmResult = async (user, query) => {
  const search = Check.countByRole(user);
  const filter = await Filter.filterCase(user, query);
  const searching = Object.assign(search, filter);
 
    let createdAt = {}
    if (query.min_date && query.max_date) {
      let searchRegExp = new RegExp('/', 'g')
      let min = query.min_date
      let max = query.max_date
      let minDate = min.replace(searchRegExp, '-')
      let maxDate = max.replace(searchRegExp, '-')
      createdAt = {
        "createdAt": {
          "$gte": new Date(new Date(minDate).setHours(00, 00, 00)),
          "$lt": new Date(new Date(maxDate).setHours(23, 59, 59))
        }
      }
    }
 
 
  const queryConfirm = [
        {
            $match: {
                $and: [
                    searching,
                    {"delete_status": {"$ne": "deleted"}},
                    {"verified_status": "verified"},
                    {"status": "POSITIF"},
                    createdAt
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
                positif_1: {$sum: { $cond: { if: { $eq: ["$final_result", null] }, then: 1, else:0  }}},
                positif_2: {$sum: { $cond: { if: { $eq: ["$final_result", ""] }, then: 1, else:0  }}},
                positif_3: {$sum: { $cond: { if: { $eq: ["$final_result", "0"] }, then: 1, else:0  }}},
                sembuh : {$sum: {$cond: { if: { $eq: ["$final_result",'1'] }, then: 1, else: 0 }}},
                meninggal : {$sum: {$cond: { if: { $eq: ["$final_result",'2'] }, then: 1, else: 0 }}},
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
                 positif: {$sum: ["$positif_1","$positif_2","$positif_3",]},
                sembuh: 1,
                meninggal: 1,
                total: {$sum: ["$positif","$sembuh", "$meninggal"]},
                date: "$_id.createdAt"
            }
        }
      ]

  return queryConfirm
}

const sqlCondition = async (user, query, status) => {
  const search = Check.countByRole(user);
  const filter = await Filter.filterCase(user, query);
  const searching = Object.assign(search, filter);
  
  let createdAt = {}
  if (query.min_date && query.max_date){
       let searchRegExp = new RegExp('/', 'g')
       let min = query.min_date
       let max = query.max_date
       let minDate = min.replace(searchRegExp, '-')
       let maxDate = max.replace(searchRegExp, '-')
       createdAt = {
           "createdAt" :{
              "$gte": new Date(new Date(minDate).setHours(00, 00, 00)),
              "$lt": new Date(new Date(maxDate).setHours(23, 59, 59))
          }}
  }
  

  const condition = [{
      $match: {
        $and: [ searching,
                { "delete_status": { "$ne": "deleted" } },
                {"verified_status": "verified"},
                { "status": status },
                createdAt
              ]
        }
      },
    {
      $project: {
        createdAt: { $dateToString: { format: "%Y/%m/%d", date: "$createdAt" }
        },
        stage: 1
      }
    },
    {
      $group: {
        _id: { createdAt: "$createdAt" },
        proses: {
          $sum: { $cond: { if: { $eq: ["$stage", '0'] }, then: 1, else: 0 } }
        },
        selesai: {
          $sum: { $cond: { if: { $eq: ["$stage", '1'] }, then: 1, else: 0 }
          }
        },
        total: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.createdAt": 1 }
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

  return condition
}

const conditionAge = async (user, query, gender) => {
  const search = Check.countByRole(user);
  const filter = await Filter.filterCase(user, query);
  const searching = Object.assign(search, filter);
  let queryStrings;
  if(query.status_patient){
    const splits = query.status_patient.split('-');
    if(splits[0] == "POSITIF" && splits[1] !== "3"){
      queryStrings = {"status": splits[0], "final_result": splits[1]}
    }else if(splits[0] == "POSITIF" && splits[1] == "3"){
      queryStrings = {"status": splits[0]}
    }else if(query.status_patient == "all"){
      queryStrings = {};
    }else{
      queryStrings = {"status": splits[0], "stage": splits[1]}
    }
  }else{
    queryStrings = {"status": "POSITIF", 
      "final_result" : { "$in": [null,"","0"] }
    };
  }
  const ageCondtion = [
    {$match: { 
      $and: [
        searching,
        {"gender":gender},
        {"delete_status": {"$ne": "deleted"}}, 
        {"verified_status": "verified"},
        queryStrings,
      ]
    }},
    {
      $project: {    
        "range": {
           $concat: [
              { $cond: [{$lte: ["$age",0]}, "Unknown", ""]}, 
              { $cond: [{$and:[ {$gt:["$age", 0 ]}, {$lt: ["$age", 5]}]}, "bawah_5", ""] },
              { $cond: [{$and:[ {$gte:["$age",6]}, {$lt:["$age", 20]}]}, "6_19", ""]},
              { $cond: [{$and:[ {$gte:["$age",20]}, {$lt:["$age", 30]}]}, "20_29", ""]},
              { $cond: [{$and:[ {$gte:["$age",30]}, {$lt:["$age", 40]}]}, "30_39", ""]},
              { $cond: [{$and:[ {$gte:["$age",40]}, {$lt:["$age", 50]}]}, "40_49", ""]},
              { $cond: [{$and:[ {$gte:["$age",50]}, {$lt:["$age", 60]}]}, "50_59", ""]},
              { $cond: [{$and:[ {$gte:["$age",60]}, {$lt:["$age", 70]}]}, "60_69", ""]},
              { $cond: [{$and:[ {$gte:["$age",70]}, {$lt:["$age", 80]}]}, "70_79", ""]},
              { $cond: [{$gte:["$age",80]}, "atas_80", ""]}
           ]
        }  
      }    
    },
    {
      $group: { 
        "_id" : "$range", 
        count: { 
          $sum: 1
        } 
      }
    }     
    ];

  return ageCondtion
}

const conditionGender = async (user, query) => {
  const search = Check.countByRole(user);
  const filter = await Filter.filterCase(user, query);
  const searching = Object.assign(search, filter);
  let queryStrings;
  if(query.status_patient){
    const splits = query.status_patient.split('-');
    if(splits[0] == "POSITIF" && splits[1] !== "3"){
      queryStrings = {"status": splits[0], "final_result": splits[1]}
    }else if(splits[0] == "POSITIF" && splits[1] == "3"){
      queryStrings = {"status": splits[0]}
    }else if(query.status_patient == "all"){
      queryStrings = {};
    }else{
      queryStrings = {"status": splits[0], "stage": splits[1]}
    }
  }else{
    queryStrings = {"status": "POSITIF", 
      "final_result" : { "$in": [null,"","0"] }
    };
  }
  const genderCondition = [
    { $match: { 
      $and: [ 
        searching, 
        {"delete_status": {"$ne": "deleted"}},
        {"verified_status": "verified"},
        queryStrings
      ]
    }},
    { $group: { _id: "$gender", "total": { $sum: 1 }}}
  ];

  return genderCondition
}

const summaryAgregatePerDinkes = async (user, query) => {  

   let createdAt = {}
   if (query.min_date && query.max_date) {
     let searchRegExp = new RegExp('/', 'g')
     let min = query.min_date
     let max = query.max_date
     let minDate = min.replace(searchRegExp, '-')
     let maxDate = max.replace(searchRegExp, '-')
     createdAt = {
       "createdAt": {
         "$gte": new Date(new Date(minDate).setHours(00, 00, 00)),
         "$lt": new Date(new Date(maxDate).setHours(23, 59, 59))
       }
     }
   }

   let groupBy ={}
   let author ={}
   if (user.role ==="dinkeskota") {
     groupBy = {kabkota: '$address_subdistrict_code'}
     author = { author_district_code: user.code_district_city}
    } else if (user.role === "dinkesprov" || user.role === "superadmin") {
      groupBy = {kabkota: '$author_district_code'}
   }


  let queryAgt = [
    {
        $match: {
            $and: [
                author,
                {"delete_status": {"$ne": "deleted"}},
                {"verified_status": "verified"},
                createdAt,
            ]
        }
    },
        {
        $group: {
            _id: groupBy,
            odp_proses: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                                { $eq: [ "$stage","0"] }
                            ] },1,0 ] }},
            odp_selesai: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                                { $eq: [ "$stage","1"] }
                            ] },1,0 ] }},
            odp_total: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                            ] },1,0 ] }},
            odp_lakilaki: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                                { $eq: [ "$gender", "L"] },
                            ] },1,0 ] }},
            odp_perempuan: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                                { $eq: [ "$gender", "P"] },
                            ] },1,0 ] }},
            odp_age_bawah_5: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                                { $gt: ["$age", 0]},
                                { $lt: ["$age", 5]}
                            ] },1,0 ] }},
            odp_age_6_19: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                                { $gte: ["$age", 6]},
                                { $lt: ["$age", 20]}
                            ] },1,0 ] }},
            odp_age_20_29: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                                { $gte: ["$age", 20]},
                                { $lt: ["$age", 30]}
                            ] },1,0 ] }},
            odp_age_30_39: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                                { $gte: ["$age", 30]},
                                { $lt: ["$age", 40]}
                            ] },1,0 ] }},
            odp_age_40_49: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                                { $gte: ["$age", 40]},
                                { $lt: ["$age", 50]}
                            ] },1,0 ] }},
            odp_age_50_59: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                                { $gte: ["$age", 50]},
                                { $lt: ["$age", 60]}
                            ] },1,0 ] }},
            odp_age_60_69: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                                { $gte: ["$age", 60]},
                                { $lt: ["$age", 70]}
                            ] },1,0 ] }},
            odp_age_70_79: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                                { $gte: ["$age", 70]},
                                { $lt: ["$age", 80]}
                            ] },1,0 ] }},
            odp_age_atas_80: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "ODP"] },
                                { $gte: ["$age", 80]}
                            ] },1,0 ] }},
            pdp_proses: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                                { $eq: [ "$stage","0"] }
                            ] },1,0 ] }},
            pdp_selesai: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                                { $eq: [ "$stage","1"] }
                            ] },1,0 ] }},
            pdp_total: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                            ] },1,0 ] }},
            pdp_lakilaki: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                                { $eq: [ "$gender", "L"] },
                            ] },1,0 ] }},
            pdp_perempuan: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                                { $eq: [ "$gender", "P"] },
                            ] },1,0 ] }},
            pdp_age_bawah_5: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                                { $gt: ["$age", 0]},
                                { $lt: ["$age", 5]}
                            ] },1,0 ] }},
            pdp_age_6_19: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                                { $gte: ["$age", 6]},
                                { $lt: ["$age", 20]}
                            ] },1,0 ] }},
            pdp_age_20_29: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                                { $gte: ["$age", 20]},
                                { $lt: ["$age", 30]}
                            ] },1,0 ] }},
            pdp_age_30_39: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                                { $gte: ["$age", 30]},
                                { $lt: ["$age", 40]}
                            ] },1,0 ] }},
            pdp_age_40_49: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                                { $gte: ["$age", 40]},
                                { $lt: ["$age", 50]}
                            ] },1,0 ] }},
            pdp_age_50_59: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                                { $gte: ["$age", 50]},
                                { $lt: ["$age", 60]}
                            ] },1,0 ] }},
            pdp_age_60_69: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                                { $gte: ["$age", 60]},
                                { $lt: ["$age", 70]}
                            ] },1,0 ] }},
            pdp_age_70_79: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                                { $gte: ["$age", 70]},
                                { $lt: ["$age", 80]}
                            ] },1,0 ] }},
            pdp_age_atas_80: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "PDP"] },
                                { $gte: ["$age", 80]}
                            ] },1,0 ] }},
            otg_proses: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                                { $eq: [ "$stage","0"] }
                            ] },1,0 ] }},
            otg_selesai: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                                { $eq: [ "$stage","1"] }
                            ] },1,0 ] }},
            otg_total: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                            ] },1,0 ] }},
            otg_lakilaki: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                                { $eq: [ "$gender", "L"] },
                            ] },1,0 ] }},
            otg_perempuan: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                                { $eq: [ "$gender", "P"] },
                            ] },1,0 ] }},
            otg_age_bawah_5: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                                { $gt: ["$age", 0]},
                                { $lt: ["$age", 5]}
                            ] },1,0 ] }},
            otg_age_6_19: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                                { $gte: ["$age", 6]},
                                { $lt: ["$age", 20]}
                            ] },1,0 ] }},
            otg_age_20_29: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                                { $gte: ["$age", 20]},
                                { $lt: ["$age", 30]}
                            ] },1,0 ] }},
            otg_age_30_39: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                                { $gte: ["$age", 30]},
                                { $lt: ["$age", 40]}
                            ] },1,0 ] }},
            otg_age_40_49: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                                { $gte: ["$age", 40]},
                                { $lt: ["$age", 50]}
                            ] },1,0 ] }},
            otg_age_50_59: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                                { $gte: ["$age", 50]},
                                { $lt: ["$age", 60]}
                            ] },1,0 ] }},
            otg_age_60_69: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                                { $gte: ["$age", 60]},
                                { $lt: ["$age", 70]}
                            ] },1,0 ] }},
            otg_age_70_79: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                                { $gte: ["$age", 70]},
                                { $lt: ["$age", 80]}
                            ] },1,0 ] }},
            otg_age_atas_80: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "OTG"] },
                                { $gte: ["$age", 80]}
                            ] },1,0 ] }},
            positif_aktif_proses_1: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", null]},
                                        {$eq: ["$stage","0"]}
                                    ]}, 1,0]}},
            positif_aktif_proses_2: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", ""]},
                                        {$eq: ["$stage","0"]}
                                    ]}, 1,0]}},
            positif_aktif_proses_3: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", "0"]},
                                        {$eq: ["$stage","0"]}
                                    ]}, 1,0]}},
            positif_aktif_selesai_1: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",null]},
                                        {$eq: ["$stage","1"]},
                                    ]}, 1,0]}},
            positif_aktif_selesai_2: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",""]},
                                        {$eq: ["$stage","1"]},
                                    ]}, 1,0]}},
            positif_aktif_selesai_3: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result","0"]},
                                        {$eq: ["$stage","1"]},
                                    ]}, 1,0]}},
            positif_aktif_total_1: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result","0"]},
                                    ]}, 1,0]}},
            positif_aktif_total_2: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",""]},
                                    ]}, 1,0]}},
            positif_aktif_total_3: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", null]},
                                    ]}, 1,0]}},
            positif_aktif_1_lakilaki: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result","0"]},
                                        {$eq: [ "$gender", "L"] },
                                    ]}, 1,0]}},
            positif_aktif_2_lakilaki: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",""]},
                                        {$eq: [ "$gender", "L"] },
                                    ]}, 1,0]}},
            positif_aktif_3_lakilaki: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", null]},
                                        {$eq: [ "$gender", "L"] },
                                    ]}, 1,0]}},
            positif_aktif_1_perempuan: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result","0"]},
                                        {$eq: [ "$gender", "P"] },
                                    ]}, 1,0]}},
            positif_aktif_2_perempuan: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",""]},
                                        {$eq: [ "$gender", "P"] },
                                    ]}, 1,0]}},
            positif_aktif_3_perempuan: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", null]},
                                        {$eq: [ "$gender", "P"] },
                                    ]}, 1,0]}},
            positif_aktif_1_bawah_5: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result","0"]},
                                        { $gt: ["$age", 0]},
                                        { $lt: ["$age", 5]}
                                    ]}, 1,0]}},
            positif_aktif_2_bawah_5: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",""]},
                                        { $gt: ["$age", 0]},
                                        { $lt: ["$age", 5]}
                                    ]}, 1,0]}},
            positif_aktif_3_bawah_5: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", null]},
                                        { $gt: ["$age", 0]},
                                        { $lt: ["$age", 5]}
                                    ]}, 1,0]}},
            positif_aktif_1_6_19: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result","0"]},
                                        { $gte: ["$age", 6]},
                                        { $lt: ["$age", 20]}
                                    ]}, 1,0]}},
            positif_aktif_2_6_19: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",""]},
                                        { $gte: ["$age", 6]},
                                        { $lt: ["$age", 20]}
                                    ]}, 1,0]}},
            positif_aktif_3_6_19: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", null]},
                                        { $gte: ["$age", 6]},
                                        { $lt: ["$age", 20]}
                                    ]}, 1,0]}},
            positif_aktif_1_20_29: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result","0"]},
                                        { $gte: ["$age", 20]},
                                        { $lt: ["$age", 30]}
                                      ]}, 1,0]}},
            positif_aktif_2_20_29: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",""]},
                                        { $gte: ["$age", 20]},
                                        { $lt: ["$age", 30]}
                                      ]}, 1,0]}},
            positif_aktif_3_20_29: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", null]},
                                        { $gte: ["$age", 20]},
                                        { $lt: ["$age", 30]}
                                      ]}, 1,0]}},
            positif_aktif_1_30_39: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result","0"]},
                                        { $gte: ["$age", 30]},
                                        { $lt: ["$age", 40]}
                                      ]}, 1,0]}},
            positif_aktif_2_30_39: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",""]},
                                        { $gte: ["$age", 30]},
                                        { $lt: ["$age", 40]}
                                      ]}, 1,0]}},
            positif_aktif_3_30_39: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", null]},
                                        { $gte: ["$age", 30]},
                                        { $lt: ["$age", 40]}
                                      ]}, 1,0]}},
            positif_aktif_1_40_49: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result","0"]},
                                        { $gte: ["$age", 40]},
                                        { $lt: ["$age", 50]}
                                      ]}, 1,0]}},
            positif_aktif_2_40_49: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",""]},
                                        { $gte: ["$age", 40]},
                                        { $lt: ["$age", 50]}
                                      ]}, 1,0]}},
            positif_aktif_3_40_49: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", null]},
                                        { $gte: ["$age", 40]},
                                        { $lt: ["$age", 50]}
                                      ]}, 1,0]}},
            positif_aktif_1_50_59: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result","0"]},
                                        { $gte: ["$age", 50]},
                                        { $lt: ["$age", 60]}
                                      ]}, 1,0]}},
            positif_aktif_2_50_59: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",""]},
                                        { $gte: ["$age", 50]},
                                        { $lt: ["$age", 60]}
                                      ]}, 1,0]}},
            positif_aktif_3_50_59: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", null]},
                                        { $gte: ["$age", 50]},
                                        { $lt: ["$age", 60]}
                                      ]}, 1,0]}},
            positif_aktif_1_60_69: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result","0"]},
                                        { $gte: ["$age", 60]},
                                        { $lt: ["$age", 70]}
                                      ]}, 1,0]}},
            positif_aktif_2_60_69: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",""]},
                                        { $gte: ["$age", 60]},
                                        { $lt: ["$age", 70]}
                                      ]}, 1,0]}},
            positif_aktif_3_60_69: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", null]},
                                        { $gte: ["$age", 60]},
                                        { $lt: ["$age", 70]}
                                      ]}, 1,0]}},
            positif_aktif_1_70_79: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result","0"]},
                                        { $gte: ["$age", 70]},
                                        { $lt: ["$age", 80]}
                                      ]}, 1,0]}},
            positif_aktif_2_70_79: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",""]},
                                        { $gte: ["$age", 70]},
                                        { $lt: ["$age", 80]}
                                      ]}, 1,0]}},
            positif_aktif_3_70_79: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", null]},
                                        { $gte: ["$age", 70]},
                                        { $lt: ["$age", 80]}
                                      ]}, 1,0]}},
            positif_aktif_1_atas_80: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result","0"]},
                                        { $gte: ["$age", 80]},
                                      ]}, 1,0]}},
            positif_aktif_2_atas_80: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result",""]},
                                        { $gte: ["$age", 80]},
                                      ]}, 1,0]}},
            positif_aktif_3_atas_80: {$sum: {$cond: [{$and: [
                                        {$eq: [ "$status", "POSITIF"] },
                                        {$eq: ["$final_result", null]},
                                        { $gte: ["$age", 80]},
                                      ]}, 1,0]}},
            positif_sembuh_proses: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                                { $eq: [ "$stage","0"] }
                            ] },1,0 ] }},
            positif_sembuh_selesai: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                                { $eq: [ "$stage","1"] }
                            ] },1,0 ] }},
            positif_sembuh_total: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                            ] },1,0 ] }},
            positif_sembuh_lakilaki: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                                {$eq: [ "$gender", "L"] },
                            ] },1,0 ] }},
            positif_sembuh_perempuan: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                                {$eq: [ "$gender", "P"] },
                            ] },1,0 ] }},
            positif_sembuh_bawah_5: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                                { $gt: ["$age", 0]},
                                { $lt: ["$age", 5]}
                            ] },1,0 ] }},
            positif_sembuh_6_19: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                                { $gte: ["$age", 6]},
                                { $lt: ["$age", 20]}
                            ] },1,0 ] }},
            positif_sembuh_20_29: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                                { $gte: ["$age", 20]},
                                { $lt: ["$age", 30]}
                            ] },1,0 ] }},
            positif_sembuh_30_39: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                                { $gte: ["$age", 30]},
                                { $lt: ["$age", 40]}
                            ] },1,0 ] }},
            positif_sembuh_40_49: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                                { $gte: ["$age", 40]},
                                { $lt: ["$age", 50]}
                            ] },1,0 ] }},
            positif_sembuh_50_59: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                                { $gte: ["$age", 50]},
                                { $lt: ["$age", 60]}
                            ] },1,0 ] }},
            positif_sembuh_60_69: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                                { $gte: ["$age", 60]},
                                { $lt: ["$age", 70]}
                            ] },1,0 ] }},
            positif_sembuh_70_79: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                                { $gte: ["$age", 70]},
                                { $lt: ["$age", 80]}
                            ] },1,0 ] }},
            positif_sembuh_atas_80: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","1"] },
                                { $gte: ["$age", 80]},
                            ] },1,0 ] }},
            positif_meninggal_proses: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                                { $eq: [ "$stage","0"] }
                            ] },1,0 ] }},
            positif_meninggal_selesai: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                                { $eq: [ "$stage","1"] }
                            ] },1,0 ] }},
            positif_meninggal_total: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                            ] },1,0 ] }},
            positif_meninggal_lakilaki: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                                {$eq: [ "$gender", "L"] },
                            ] },1,0 ] }},
            positif_meninggal_perempuan: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                                {$eq: [ "$gender", "P"] },
                            ] },1,0 ] }},
            positif_meninggal_bawah_5: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                                { $gt: ["$age", 0]},
                                { $lt: ["$age", 5]}
                            ] },1,0 ] }},
            positif_meninggal_6_19: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                                { $gte: ["$age", 6]},
                                { $lt: ["$age", 20]}
                            ] },1,0 ] }},
            positif_meninggal_20_29: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                                { $gte: ["$age", 20]},
                                { $lt: ["$age", 30]}
                            ] },1,0 ] }},
            positif_meninggal_30_39: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                                { $gte: ["$age", 30]},
                                { $lt: ["$age", 40]}
                            ] },1,0 ] }},
            positif_meninggal_40_49: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                                { $gte: ["$age", 40]},
                                { $lt: ["$age", 50]}
                            ] },1,0 ] }},
            positif_meninggal_50_59: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                                { $gte: ["$age", 50]},
                                { $lt: ["$age", 60]}
                            ] },1,0 ] }},
            positif_meninggal_60_69: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                                { $gte: ["$age", 60]},
                                { $lt: ["$age", 70]}
                            ] },1,0 ] }},
            positif_meninggal_70_79: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                                { $gte: ["$age", 70]},
                                { $lt: ["$age", 80]}
                            ] },1,0 ] }},
            positif_meninggal_atas_80: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$status", "POSITIF"] },
                                { $eq: [ "$final_result","2"] },
                                { $gte: ["$age", 80]},
                            ] },1,0 ] }},
            wni_total: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$nationality", "WNI"] },
                            ] },1,0 ] }},
            wna_total: {$sum: 
                        { $cond: [ 
                            { $and : [ 
                                { $eq: [ "$nationality", "WNA"] },
                            ] },1,0 ] }},
        }
    },
    {
        $project: {
            _id: 0,
            kab_kota: {$toUpper: "$_id.kabkota"},
            odp_proses: 1,
            odp_selesai: 1,
            odp_total: 1,
            odp_lakilaki: 1,
            odp_perempuan: 1,
              odp_age_bawah_5: 1,
              odp_age_6_19: 1,
              odp_age_20_29: 1,
              odp_age_30_39: 1,
              odp_age_40_49: 1,
              odp_age_50_59: 1,
              odp_age_60_69: 1,
              odp_age_70_79: 1,
              odp_age_atas_80: 1,
            pdp_proses: 1,
            pdp_selesai: 1,
            pdp_total: 1,
            pdp_lakilaki: 1,
            pdp_perempuan: 1,
              pdp_age_bawah_5: 1,
              pdp_age_6_19: 1,
              pdp_age_20_29: 1,
              pdp_age_30_39: 1,
              pdp_age_40_49: 1,
              pdp_age_50_59: 1,
              pdp_age_60_69: 1,
              pdp_age_70_79: 1,
              pdp_age_atas_80: 1,
            otg_proses: 1,
            otg_selesai: 1,
            otg_total: 1,
            otg_lakilaki: 1,
            otg_perempuan: 1,
              otg_age_bawah_5: 1,
              otg_age_6_19: 1,
              otg_age_20_29: 1,
              otg_age_30_39: 1,
              otg_age_40_49: 1,
              otg_age_50_59: 1,
              otg_age_60_69: 1,
              otg_age_70_79: 1,
              otg_age_atas_80: 1,
            positif_aktif_proses: {$sum: ["$positif_aktif_proses_1", "$positif_aktif_proses_2", "$positif_aktif_proses_3"]},
            positif_aktif_selesai: {$sum: ["$positif_aktif_selesai_1","$positif_aktif_selesai_2","$positif_aktif_selesai_3"]},
            positif_aktif_total: {$sum: ["$positif_aktif_total_1", "$positif_aktif_total_2", "$positif_aktif_total_3"]},
            positif_aktif_lakilaki: {$sum: ["$positif_aktif_1_lakilaki", "$positif_aktif_2_lakilaki", "$positif_aktif_3_lakilaki"]},
            positif_aktif_perempuan: {$sum: ["$positif_aktif_1_perempuan", "$positif_aktif_2_perempuan", "$positif_aktif_3_perempuan"]},
              positif_aktif_bawah_5: {$sum: ["$positif_aktif_1_bawah_5", "$positif_aktif_2_bawah_5", "$positif_aktif_3_bawah_5"]}, 
              positif_aktif_6_19: {$sum: ["$positif_aktif_1_6_19", "$positif_aktif_2_6_19", "$positif_aktif_3_6_19"]}, 
              positif_aktif_20_29: {$sum: ["$positif_aktif_1_20_29", "$positif_aktif_2_20_29", "$positif_aktif_3_20_29"]}, 
              positif_aktif_30_39: {$sum: ["$positif_aktif_1_30_39", "$positif_aktif_2_30_39", "$positif_aktif_3_30_39"]}, 
              positif_aktif_40_49: {$sum: ["$positif_aktif_1_40_49", "$positif_aktif_2_40_49", "$positif_aktif_3_40_49"]}, 
              positif_aktif_50_59: {$sum: ["$positif_aktif_1_50_59", "$positif_aktif_2_50_59", "$positif_aktif_3_50_59"]}, 
              positif_aktif_60_69: {$sum: ["$positif_aktif_1_60_69", "$positif_aktif_2_60_69", "$positif_aktif_3_60_69"]}, 
              positif_aktif_70_79: {$sum: ["$positif_aktif_1_70_79", "$positif_aktif_2_70_79", "$positif_aktif_3_70_79"]}, 
              positif_aktif_atas_80: {$sum: ["$positif_aktif_1_atas_80", "$positif_aktif_2_atas_80", "$positif_aktif_3_atas_80"]}, 
            positif_sembuh_proses: 1,
            positif_sembuh_selesai: 1,
            positif_sembuh_total: 1,
            positif_sembuh_lakilaki: 1,
            positif_sembuh_perempuan: 1,
              positif_sembuh_bawah_5: 1,
              positif_sembuh_6_19: 1,
              positif_sembuh_20_29: 1,
              positif_sembuh_30_39: 1,
              positif_sembuh_40_49: 1,
              positif_sembuh_50_59: 1,
              positif_sembuh_60_69: 1,
              positif_sembuh_70_79: 1,
              positif_sembuh_atas_80: 1,
            positif_meninggal_proses: 1,
            positif_meninggal_selesai: 1,
            positif_meninggal_total: 1,
            positif_meninggal_lakilaki: 1,
            positif_meninggal_perempuan: 1, 
              positif_meninggal_bawah_5: 1,
              positif_meninggal_6_19: 1,
              positif_meninggal_20_29: 1,
              positif_meninggal_30_39: 1,
              positif_meninggal_40_49: 1,
              positif_meninggal_50_59: 1,
              positif_meninggal_60_69: 1,
              positif_meninggal_70_79: 1,
              positif_meninggal_atas_80: 1,
            // positif_proses: {$sum:["$positif_aktif_proses_1", "$positif_aktif_proses_2", "$positif_aktif_proses_3","$positif_sembuh_proses","$positif_meninggal_proses"]},
            // positif_selesai: {$sum:["$positif_aktif_selesai_1","$positif_aktif_selesai_2","$positif_aktif_selesai_3","$positif_sembuh_selesai","$positif_meninggal_selesai"]},
            wni_total: 1,
            wna_total: 1,
            grand_total: {
              $sum: ["$odp_total", "$pdp_total", "$otg_total", 
                      "$positif_aktif_total_1", 
                      "$positif_aktif_total_2", 
                      "$positif_aktif_total_3", 
                      "$positif_sembuh_total", 
                      "$positif_meninggal_total"]
            }
        }
    },
    {
        $sort: {"kab_kota": 1}
    },
]


  return queryAgt
}

module.exports = {
  sqlCondition, 
  conditionAge, 
  conditionGender, 
  conditionConfirmResult,
  summaryAgregatePerDinkes
}