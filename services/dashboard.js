require('../models/Case');
const Mongoose = require('mongoose');
const Helpers = require('../helpers/dashboardbottom');
const Case = Mongoose.model('Case');
const Sql = require('../helpers/sectionnumber');
const Check = require('../helpers/rolecheck');
const Filter = require('../helpers/casefilter');


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
}

const countByOdp = async (query, user, callback) => {
  try {
    const queryODP = await Sql.sqlCondition(user, query, "ODP");
    const result = await Case.aggregate(queryODP);

    let get_date = []
    result.forEach((val, key) => {
      get_date.push(new Date(val.date))
    })
    
    var maxDate = new Date(Math.max.apply(null, get_date));
    var minDate = new Date(Math.min.apply(null, get_date));
    
    let date_range =[]
    for (let index = minDate; index <= maxDate; index.setDate(index.getDate() + 1)){
        var mm = ((index.getMonth() + 1) >= 10) ? (index.getMonth() + 1) : '0' + (index.getMonth() + 1);
        var dd = ((index.getDate()) >= 10) ? (index.getDate()) : '0' + (index.getDate());
        var yyyy = index.getFullYear();
        var date = yyyy+"/"+mm+"/"+dd
        date_range.push(date)
    }

    let get_result_date = []
    result.forEach((val, key) => {
      get_result_date.push(val.date)
    })

    let result2 = []
    date_range.forEach((val, key) =>{
      if (!get_result_date.includes(val)) {
        result2.push({
          proses: 0,
          selesai: 0,
          total: 0,
          date: val
        })
      }
    })

    let res = result2.concat(result)
    res.sort((a, b) => {
      var dateA = new Date(a.date),
        dateB = new Date(b.date)
      return dateA - dateB //sort by date ascending
    })

    let cum_proses =[]
    let cum_selesai =[]
    res.forEach((val, key) =>{
      cum_proses.push(val.proses)
      cum_selesai.push(val.selesai)
    })
    
    let triger_selesai = 0
    let result_cum_selesai =[]
    cum_selesai.map(x => {
      triger_selesai += x
      result_cum_selesai.push({
        cum_selesai: triger_selesai
      })
    })
  

    let triger_proses = 0
    let result_cum_proses = []
    cum_proses.map(z => {
      triger_proses += z
      result_cum_proses.push({
        cum_proses: triger_proses
      })
    })

    let cum_proses_selesai = []
    res.forEach((val, key)=>{
      val = Object.assign(val,result_cum_proses[key])
      val = Object.assign(val,result_cum_selesai[key])
      cum_proses_selesai.push(val)
    })
    

    callback(null, cum_proses_selesai);
  } catch (error) {
    callback(error, null);
  }
}

const countByPdp = async (query, user, callback) => {
  try {
    const queryODP = await Sql.sqlCondition(user, query, "PDP");
    const result = await Case.aggregate(queryODP);

       let get_date = []
       result.forEach((val, key) => {
         get_date.push(new Date(val.date))
       })

       var maxDate = new Date(Math.max.apply(null, get_date));
       var minDate = new Date(Math.min.apply(null, get_date));

       let date_range = []
       for (let index = minDate; index <= maxDate; index.setDate(index.getDate() + 1)) {
         var mm = ((index.getMonth() + 1) >= 10) ? (index.getMonth() + 1) : '0' + (index.getMonth() + 1);
         var dd = ((index.getDate()) >= 10) ? (index.getDate()) : '0' + (index.getDate());
         var yyyy = index.getFullYear();
         var date = yyyy + "/" + mm + "/" + dd
         date_range.push(date)
       }

       let get_result_date = []
       result.forEach((val, key) => {
         get_result_date.push(val.date)
       })

       let result2 = []
       date_range.forEach((val, key) => {
         if (!get_result_date.includes(val)) {
           result2.push({
             proses: 0,
             selesai: 0,
             total: 0,
             date: val
           })
         }
       })

      let res = result2.concat(result)
      res.sort((a, b) => {
        var dateA = new Date(a.date),
          dateB = new Date(b.date)
        return dateA - dateB //sort by date ascending
      })

      let cum_proses = []
      let cum_selesai = []
      res.forEach((val, key) => {
        cum_proses.push(val.proses)
        cum_selesai.push(val.selesai)
      })

      let triger_selesai = 0
      let result_cum_selesai = []
      cum_selesai.map(x => {
        triger_selesai += x
        result_cum_selesai.push({
          cum_selesai: triger_selesai
        })
      })


      let triger_proses = 0
      let result_cum_proses = []
      cum_proses.map(z => {
        triger_proses += z
        result_cum_proses.push({
          cum_proses: triger_proses
        })
      })

      let cum_proses_selesai = []
      res.forEach((val, key) => {
        val = Object.assign(val, result_cum_proses[key])
        val = Object.assign(val, result_cum_selesai[key])
        cum_proses_selesai.push(val)
      })


    callback(null, cum_proses_selesai);
  } catch (error) {
    callback(error, null);
  }
}

const countByOtg = async (query, user, callback) => {
  try {
    const queryOtg = await Sql.sqlCondition(user, query, "OTG");
    const result = await Case.aggregate(queryOtg);

       let get_date = []
       result.forEach((val, key) => {
         get_date.push(new Date(val.date))
       })

       var maxDate = new Date(Math.max.apply(null, get_date));
       var minDate = new Date(Math.min.apply(null, get_date));

       let date_range = []
       for (let index = minDate; index <= maxDate; index.setDate(index.getDate() + 1)) {
         var mm = ((index.getMonth() + 1) >= 10) ? (index.getMonth() + 1) : '0' + (index.getMonth() + 1);
         var dd = ((index.getDate()) >= 10) ? (index.getDate()) : '0' + (index.getDate());
         var yyyy = index.getFullYear();
         var date = yyyy + "/" + mm + "/" + dd
         date_range.push(date)
       }

       let get_result_date = []
       result.forEach((val, key) => {
         get_result_date.push(val.date)
       })

       let result2 = []
       date_range.forEach((val, key) => {
         if (!get_result_date.includes(val)) {
           result2.push({
             proses: 0,
             selesai: 0,
             total: 0,
             date: val
           })
         }
       })

      let res = result2.concat(result)
      res.sort((a, b) => {
        var dateA = new Date(a.date),
          dateB = new Date(b.date)
        return dateA - dateB //sort by date ascending
      })

      let cum_proses = []
      let cum_selesai = []
      res.forEach((val, key) => {
        cum_proses.push(val.proses)
        cum_selesai.push(val.selesai)
      })

      let triger_selesai = 0
      let result_cum_selesai = []
      cum_selesai.map(x => {
        triger_selesai += x
        result_cum_selesai.push({
          cum_selesai: triger_selesai
        })
      })


      let triger_proses = 0
      let result_cum_proses = []
      cum_proses.map(z => {
        triger_proses += z
        result_cum_proses.push({
          cum_proses: triger_proses
        })
      })

      let cum_proses_selesai = []
      res.forEach((val, key) => {
        val = Object.assign(val, result_cum_proses[key])
        val = Object.assign(val, result_cum_selesai[key])
        cum_proses_selesai.push(val)
      })

    callback(null, cum_proses_selesai);
  } catch (error) {
    callback(error, null);
  }
}

const countByConfirm = async (query, user, callback) => {
  try {
    
    const queryConfirm = await Sql.conditionConfirmResult(user, query);
    console.log(JSON.stringify(queryConfirm));
    
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