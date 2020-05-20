require('../models/Case');
const Mongoose = require('mongoose');
const Helpers = require('../helpers/dashboardbottom');
const Case = Mongoose.model('Case');
const DistrictCity = Mongoose.model('Districtcity')
const SubDistrict = Mongoose.model('SubDistrict')
const Sql = require('../helpers/sectionnumber');

const summaryAggregateByDinkes = async (query, user, callback) =>{
  try {
    let querySummary = await Sql.summaryAgregatePerDinkes(user, query)
    let result = await Case.aggregate(querySummary)

    let getKabkotaCodeAndName = []
   
    if (user.role ==="dinkeskota") {
       let kab_kota = await SubDistrict.find({'kemendagri_kabupaten_kode': user.code_district_city})
         kab_kota.forEach((val, key) => {
           getKabkotaCodeAndName.push({
             kab_kota: val.kemendagri_kecamatan_kode,
             kab_kota_name: val.kemendagri_kecamatan_nama
           })
         })
    } else if (user.role === "dinkesprov" || user.role === "superadmin") {
       let kab_kota = await DistrictCity.find({'kemendagri_provinsi_kode':'32'})
        kab_kota.forEach((val, key) => {
          getKabkotaCodeAndName.push({
            kab_kota: val.kemendagri_kabupaten_kode,
            kab_kota_name: val.kemendagri_kabupaten_nama
          })
        })
    }



    let sum_odp_proses = 0
    let sum_odp_selesai = 0
    let sum_odp_total = 0
    let sum_pdp_proses = 0
    let sum_pdp_selesai = 0
    let sum_pdp_total = 0
    let sum_otg_proses = 0
    let sum_otg_selesai = 0
    let sum_otg_total = 0
    let sum_positif_aktif_proses = 0
    let sum_positif_aktif_selesai = 0
    let sum_positif_aktif_total = 0
    let sum_positif_sembuh_proses = 0
    let sum_positif_sembuh_selesai = 0
    let sum_positif_sembuh_total = 0
    let sum_positif_meninggal_proses = 0
    let sum_positif_meninggal_selesai = 0
    let sum_positif_meninggal_total = 0
    let sum_positif_proses = 0
    let sum_positif_selesai = 0
    let sum_grand_total = 0

    let combine_data = []
    result.forEach((val, key) =>{

        sum_odp_proses += val.odp_proses
        sum_odp_selesai += val.odp_selesai
        sum_odp_total += val.odp_total
        sum_pdp_proses += val.pdp_proses
        sum_pdp_selesai += val.pdp_selesai
        sum_pdp_total += val.pdp_total
        sum_otg_proses += val.otg_proses
        sum_otg_selesai += val.otg_selesai
        sum_otg_total += val.otg_total
        sum_positif_aktif_proses += val.positif_aktif_proses
        sum_positif_aktif_selesai += val.positif_aktif_selesai
        sum_positif_aktif_total += val.positif_aktif_total
        sum_positif_sembuh_proses += val.positif_sembuh_proses
        sum_positif_sembuh_selesai += val.positif_sembuh_selesai
        sum_positif_sembuh_total += val.positif_sembuh_total
        sum_positif_meninggal_proses += val.positif_meninggal_proses
        sum_positif_meninggal_selesai += val.positif_meninggal_selesai
        sum_positif_meninggal_total += val.positif_meninggal_total
        sum_positif_proses += val.positif_proses
        sum_positif_selesai += val.positif_selesai
        sum_grand_total += val.grand_total
        
        getKabkotaCodeAndName.forEach((val1,key1) =>{
            if (val.kab_kota === val1.kab_kota) {
              combine_data.push({
                kab_kota_name: val1.kab_kota_name,
                kab_kota_code: val.kab_kota,
                odp_proses: val.odp_proses,
                odp_selesai: val.odp_selesai,
                odp_total: val.odp_total,
                pdp_proses: val.pdp_proses,
                pdp_selesai: val.pdp_selesai,
                pdp_total: val.pdp_total,
                otg_proses: val.otg_proses,
                otg_selesai: val.otg_selesai,
                otg_total: val.otg_total,
                positif_aktif_proses: val.positif_aktif_proses,
                positif_aktif_selesai: val.positif_aktif_selesai,
                positif_aktif_total: val.positif_aktif_total,
                positif_sembuh_proses: val.positif_sembuh_proses,
                positif_sembuh_selesai: val.positif_sembuh_selesai,
                positif_sembuh_total: val.positif_sembuh_total,
                positif_meninggal_proses: val.positif_meninggal_proses,
                positif_meninggal_selesai: val.positif_meninggal_selesai,
                positif_meninggal_total: val.positif_meninggal_total,
                positif_proses: val.positif_proses,
                positif_selesai: val.positif_selesai,
                grand_total: val.grand_total,
              })
            }
        })
    })
    
    let output ={
      summary : combine_data,
      total: {
        sum_odp_proses: sum_odp_proses,
        sum_odp_selesai: sum_odp_selesai,
        sum_odp_total: sum_odp_total,
        sum_pdp_proses: sum_pdp_proses,
        sum_pdp_selesai: sum_pdp_selesai,
        sum_pdp_total: sum_pdp_total,
        sum_otg_proses: sum_otg_proses,
        sum_otg_selesai: sum_otg_selesai,
        sum_otg_total: sum_otg_total,
        sum_positif_aktif_proses: sum_positif_aktif_proses,
        sum_positif_aktif_selesai: sum_positif_aktif_selesai,
        sum_positif_aktif_total: sum_positif_aktif_total,
        sum_positif_sembuh_proses: sum_positif_sembuh_proses,
        sum_positif_sembuh_selesai: sum_positif_sembuh_selesai,
        sum_positif_sembuh_total: sum_positif_sembuh_total,
        sum_positif_meninggal_proses: sum_positif_meninggal_proses,
        sum_positif_meninggal_selesai: sum_positif_meninggal_selesai,
        sum_positif_meninggal_total: sum_positif_meninggal_total,
        sum_positif_proses: sum_positif_proses,
        sum_positif_selesai: sum_positif_selesai,
        sum_grand_total: sum_grand_total,
      }
    }
  
    return callback(null, output)
  } catch (error) {
    callback(error, null)
  }
}


const countByGenderAge = async (query, user, callback) => {
  try {
    const conditionAgeMale = await Sql.conditionAge(user, query, "L");
    const conditionAgeFemale = await Sql.conditionAge(user, query, "P");
    const conditionGender = await Sql.conditionGender(user, query);
    const ageGroupMale = await Case.aggregate(conditionAgeMale);
    const ageGroupFemale = await Case.aggregate(conditionAgeFemale);
    const genderGroup = await Case.aggregate(conditionGender);
    const results = await Helpers.filterJson(ageGroupMale, ageGroupFemale, genderGroup);
    callback(null,results);
  } catch (error) {
    callback(error, null);
  }
}

const countByOdp = async (query, user, callback) => {
  try {
    const queryODP = await Sql.sqlCondition(user, query, "ODP");
    const result = await Case.aggregate(queryODP)

    let get_date = []
    result.forEach((val, key) => {
      get_date.push(new Date(val.date))
    })
    
    
    if (query.min_date && query.max_date) {
      var minDate = new Date(query.min_date);
      var maxDate = new Date(query.max_date);
    } else {
      var minDate = new Date(Math.min.apply(null, get_date));
      var maxDate = new Date(Math.max.apply(null, get_date));
    }

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

const countByPdp = async (query, user, callback) => {
  try {
    const queryODP = await Sql.sqlCondition(user, query, "PDP");
    const result = await Case.aggregate(queryODP);

       let get_date = []
       result.forEach((val, key) => {
         get_date.push(new Date(val.date))
       })

       if (query.min_date && query.max_date) {
         var minDate = new Date(query.min_date);
         var maxDate = new Date(query.max_date);
       } else {
         var minDate = new Date(Math.min.apply(null, get_date));
         var maxDate = new Date(Math.max.apply(null, get_date));
       }

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

       if (query.min_date && query.max_date) {
         var minDate = new Date(query.min_date);
         var maxDate = new Date(query.max_date);
       } else {
         var minDate = new Date(Math.min.apply(null, get_date));
         var maxDate = new Date(Math.max.apply(null, get_date));
       }


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
    const result = await Case.aggregate(queryConfirm);
    
    let get_date = []
    result.forEach((val, key) => {
      get_date.push(new Date(val.date))
    })

    if (query.min_date && query.max_date) {
      var minDate = new Date(query.min_date);
      var maxDate = new Date(query.max_date);
    } else {
      var minDate = new Date(Math.min.apply(null, get_date));
      var maxDate = new Date(Math.max.apply(null, get_date));
    }

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
          positif: 0,
          sembuh: 0,
          meninggal: 0,
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

    let cum_positif = []
    let cum_sembuh = []
    let cum_meninggal = []
    res.forEach((val, key) => {
      cum_positif.push(val.positif)
      cum_sembuh.push(val.sembuh)
      cum_meninggal.push(val.meninggal)
    })

    let triger_positif = 0
    let result_cum_positif = []
    cum_positif.map(x => {
      triger_positif += x
      result_cum_positif.push({
        cum_positif: triger_positif
      })
    })

    let triger_sembuh = 0
    let result_cum_sembuh = []
    cum_sembuh.map(z => {
      triger_sembuh += z
      result_cum_sembuh.push({
        cum_sembuh: triger_sembuh
      })
    })

    let triger_meninggal = 0
    let result_cum_meninggal = []
    cum_meninggal.map(z => {
      triger_meninggal += z
      result_cum_meninggal.push({
        cum_meninggal: triger_meninggal
      })
    })


    let cum_positif_sembuh_meninggal = []
    res.forEach((val, key) => {
      val = Object.assign(val, result_cum_positif[key])
      val = Object.assign(val, result_cum_sembuh[key])
      val = Object.assign(val, result_cum_meninggal[key])
      cum_positif_sembuh_meninggal.push(val)
    })


    callback(null, cum_positif_sembuh_meninggal);
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
  {
    name: "services.dashboard.summaryAggregateByDinkes",
    method: summaryAggregateByDinkes
  },
]