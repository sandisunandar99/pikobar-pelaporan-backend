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
      //  let kab_kota = await SubDistrict.find({'kemendagri_kabupaten_kode': user.code_district_city})
        let name_group ="Kecamatan"
        let kab_kota = await SubDistrict.find()
         kab_kota.forEach((val, key) => {
           getKabkotaCodeAndName.push({
             kab_kota: val.kemendagri_kecamatan_kode,
             kab_kota_name: val.kemendagri_kecamatan_nama
           })
         })
    } else if (user.role === "dinkesprov" || user.role === "superadmin") {
        let name_group = "Kabupaten/Kota"
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
    let sum_odp_lakilaki = 0
    let sum_odp_perempuan = 0
    let sum_odp_age_bawah_5 = 0
    let sum_odp_age_6_19 = 0
    let sum_odp_age_20_29 = 0
    let sum_odp_age_30_39 = 0
    let sum_odp_age_40_49 = 0
    let sum_odp_age_50_59 = 0
    let sum_odp_age_60_69 = 0
    let sum_odp_age_70_79 = 0
    let sum_odp_age_atas_80 = 0


    let sum_pdp_proses = 0
    let sum_pdp_selesai = 0
    let sum_pdp_total = 0
    let sum_pdp_lakilaki = 0
    let sum_pdp_perempuan = 0
    let sum_pdp_age_bawah_5 = 0
    let sum_pdp_age_6_19 = 0
    let sum_pdp_age_20_29 = 0
    let sum_pdp_age_30_39 = 0
    let sum_pdp_age_40_49 = 0
    let sum_pdp_age_50_59 = 0
    let sum_pdp_age_60_69 = 0
    let sum_pdp_age_70_79 = 0
    let sum_pdp_age_atas_80 = 0

    let sum_otg_proses = 0
    let sum_otg_selesai = 0
    let sum_otg_total = 0
    let sum_otg_lakilaki = 0
    let sum_otg_perempuan = 0
    let sum_otg_age_bawah_5 = 0
    let sum_otg_age_6_19 = 0
    let sum_otg_age_20_29 = 0
    let sum_otg_age_30_39 = 0
    let sum_otg_age_40_49 = 0
    let sum_otg_age_50_59 = 0
    let sum_otg_age_60_69 = 0
    let sum_otg_age_70_79 = 0
    let sum_otg_age_atas_80 = 0

    let sum_positif_aktif_proses = 0
    let sum_positif_aktif_selesai = 0
    let sum_positif_aktif_total = 0
    let sum_positif_aktif_lakilaki = 0
    let sum_positif_aktif_perempuan = 0
    let sum_positif_aktif_bawah_5 = 0
    let sum_positif_aktif_6_19 = 0
    let sum_positif_aktif_20_29 = 0
    let sum_positif_aktif_30_39 = 0
    let sum_positif_aktif_40_49 = 0
    let sum_positif_aktif_50_59 = 0
    let sum_positif_aktif_60_69 = 0
    let sum_positif_aktif_70_79 = 0
    let sum_positif_aktif_atas_80 = 0


    let sum_positif_sembuh_proses = 0
    let sum_positif_sembuh_selesai = 0
    let sum_positif_sembuh_total = 0
    let sum_positif_sembuh_lakilaki = 0
    let sum_positif_sembuh_perempuan = 0
    let sum_positif_sembuh_bawah_5 = 0
    let sum_positif_sembuh_6_19 = 0
    let sum_positif_sembuh_20_29 = 0
    let sum_positif_sembuh_30_39 = 0
    let sum_positif_sembuh_40_49 = 0
    let sum_positif_sembuh_50_59 = 0
    let sum_positif_sembuh_60_69 = 0
    let sum_positif_sembuh_70_79 = 0
    let sum_positif_sembuh_atas_80 = 0

    let sum_positif_meninggal_proses = 0
    let sum_positif_meninggal_selesai = 0
    let sum_positif_meninggal_total = 0
    let sum_positif_meninggal_lakilaki = 0
    let sum_positif_meninggal_perempuan = 0
    let sum_positif_meninggal_bawah_5 = 0
    let sum_positif_meninggal_6_19 = 0
    let sum_positif_meninggal_20_29 = 0
    let sum_positif_meninggal_30_39 = 0
    let sum_positif_meninggal_40_49 = 0
    let sum_positif_meninggal_50_59 = 0
    let sum_positif_meninggal_60_69 = 0
    let sum_positif_meninggal_70_79 = 0
    let sum_positif_meninggal_atas_80 = 0

    // let sum_positif_proses = 0
    // let sum_positif_selesai = 0
    let sum_wni_total = 0
    let sum_wna_total = 0
    let sum_grand_total = 0

    let combine_data = []
    result.forEach((val, key) =>{

        sum_odp_proses += val.odp_proses
        sum_odp_selesai += val.odp_selesai
        sum_odp_total += val.odp_total
        sum_odp_lakilaki += val.odp_lakilaki 
        sum_odp_perempuan += val.odp_perempuan
        sum_odp_age_bawah_5 += val.odp_age_bawah_5
        sum_odp_age_6_19 += val.odp_age_6_19
        sum_odp_age_20_29 += val.odp_age_20_29
        sum_odp_age_30_39 += val.odp_age_30_39
        sum_odp_age_40_49 += val.odp_age_40_49
        sum_odp_age_50_59 += val.odp_age_50_59
        sum_odp_age_60_69 += val.odp_age_60_69
        sum_odp_age_70_79 += val.odp_age_70_79
        sum_odp_age_atas_80 += val.odp_age_atas_80

        sum_pdp_proses += val.pdp_proses
        sum_pdp_selesai += val.pdp_selesai
        sum_pdp_total += val.pdp_total
        sum_pdp_lakilaki += val.pdp_lakilaki
        sum_pdp_perempuan += val.pdp_perempuan
        sum_pdp_age_bawah_5 += val.pdp_age_bawah_5
        sum_pdp_age_6_19 += val.pdp_age_6_19
        sum_pdp_age_20_29 += val.pdp_age_20_29
        sum_pdp_age_30_39 += val.pdp_age_30_39
        sum_pdp_age_40_49 += val.pdp_age_40_49
        sum_pdp_age_50_59 += val.pdp_age_50_59
        sum_pdp_age_60_69 += val.pdp_age_60_69
        sum_pdp_age_70_79 += val.pdp_age_70_79
        sum_pdp_age_atas_80 += val.pdp_age_atas_80

        sum_otg_proses += val.otg_proses
        sum_otg_selesai += val.otg_selesai
        sum_otg_total += val.otg_total
        sum_otg_lakilaki += val.otg_lakilaki
        sum_otg_perempuan += val.otg_perempuan
        sum_otg_age_bawah_5 += val.otg_age_bawah_5
        sum_otg_age_6_19 += val.otg_age_6_19
        sum_otg_age_20_29 += val.otg_age_20_29
        sum_otg_age_30_39 += val.otg_age_30_39
        sum_otg_age_40_49 += val.otg_age_40_49
        sum_otg_age_50_59 += val.otg_age_50_59
        sum_otg_age_60_69 += val.otg_age_60_69
        sum_otg_age_70_79 += val.otg_age_70_79
        sum_otg_age_atas_80 += val.otg_age_atas_80

        sum_positif_aktif_proses += val.positif_aktif_proses
        sum_positif_aktif_selesai += val.positif_aktif_selesai
        sum_positif_aktif_total += val.positif_aktif_total
        sum_positif_aktif_lakilaki += val.positif_aktif_lakilaki
        sum_positif_aktif_perempuan += val.positif_aktif_perempuan
        sum_positif_aktif_bawah_5 += val.positif_aktif_bawah_5
        sum_positif_aktif_6_19 += val.positif_aktif_6_19
        sum_positif_aktif_20_29 += val.positif_aktif_20_29
        sum_positif_aktif_30_39 += val.positif_aktif_30_39
        sum_positif_aktif_40_49 += val.positif_aktif_40_49
        sum_positif_aktif_50_59 += val.positif_aktif_50_59
        sum_positif_aktif_60_69 += val.positif_aktif_60_69
        sum_positif_aktif_70_79 += val.positif_aktif_70_79
        sum_positif_aktif_atas_80 += val.positif_aktif_atas_80

        sum_positif_sembuh_proses += val.positif_sembuh_proses
        sum_positif_sembuh_selesai += val.positif_sembuh_selesai
        sum_positif_sembuh_total += val.positif_sembuh_total
        sum_positif_sembuh_lakilaki += val.positif_sembuh_lakilaki
        sum_positif_sembuh_perempuan += val.positif_sembuh_perempuan
        sum_positif_sembuh_bawah_5 += val.positif_sembuh_bawah_5
        sum_positif_sembuh_6_19 += val.positif_sembuh_6_19
        sum_positif_sembuh_20_29 += val.positif_sembuh_20_29
        sum_positif_sembuh_30_39 += val.positif_sembuh_30_39
        sum_positif_sembuh_40_49 += val.positif_sembuh_40_49
        sum_positif_sembuh_50_59 += val.positif_sembuh_50_59
        sum_positif_sembuh_60_69 += val.positif_sembuh_60_69
        sum_positif_sembuh_70_79 += val.positif_sembuh_70_79
        sum_positif_sembuh_atas_80 += val.positif_sembuh_atas_80

        sum_positif_meninggal_proses += val.positif_meninggal_proses
        sum_positif_meninggal_selesai += val.positif_meninggal_selesai
        sum_positif_meninggal_total += val.positif_meninggal_total
        sum_positif_meninggal_lakilaki += val.positif_meninggal_lakilaki
        sum_positif_meninggal_perempuan += val.positif_meninggal_perempuan
        sum_positif_meninggal_bawah_5 += val.positif_meninggal_bawah_5
        sum_positif_meninggal_6_19 += val.positif_meninggal_6_19
        sum_positif_meninggal_20_29 += val.positif_meninggal_20_29
        sum_positif_meninggal_30_39 += val.positif_meninggal_30_39
        sum_positif_meninggal_40_49 += val.positif_meninggal_40_49
        sum_positif_meninggal_50_59 += val.positif_meninggal_50_59
        sum_positif_meninggal_60_69 += val.positif_meninggal_60_69
        sum_positif_meninggal_70_79 += val.positif_meninggal_70_79
        sum_positif_meninggal_atas_80 += val.positif_meninggal_atas_80

        // sum_positif_proses += val.positif_proses
        // sum_positif_selesai += val.positif_selesai
        sum_wni_total += val.wni_total
        sum_wna_total += val.wna_total
        sum_grand_total += val.grand_total
        
        getKabkotaCodeAndName.forEach((val1,key1) =>{
           if (val.kab_kota === val1.kab_kota) {
            combine_data.push({
                kotkabkec: val1.kab_kota_name,
                odp_proses: val.odp_proses,
                odp_selesai: val.odp_selesai,
                odp_total: val.odp_total,
                odp_by_gender: {
                    laki_laki: val.odp_lakilaki,
                    perempuan: val.odp_perempuan,
                },
                odp_by_usia: {
                  bawah_5: val.odp_age_bawah_5,
                  "6_19": val.odp_age_6_19,
                  "20_29": val.odp_age_20_29,
                  "30_39": val.odp_age_30_39,
                  "40_49": val.odp_age_40_49,
                  "50_59": val.odp_age_50_59,
                  "60_69": val.odp_age_60_69,
                  "70_79": val.odp_age_70_79,
                  atas_80: val.odp_age_atas_80,
                },
                pdp_proses: val.pdp_proses,
                pdp_selesai: val.pdp_selesai,
                pdp_total: val.pdp_total,
                pdp_by_gender: {
                  laki_laki: val.pdp_lakilaki,
                  perempuan: val.pdp_perempuan,
                },
                pdp_by_usia: {
                  bawah_5: val.pdp_age_bawah_5,
                  "6_19": val.pdp_age_6_19,
                  "20_29": val.pdp_age_20_29,
                  "30_39": val.pdp_age_30_39,
                  "40_49": val.pdp_age_40_49,
                  "50_59": val.pdp_age_50_59,
                  "60_69": val.pdp_age_60_69,
                  "70_79": val.pdp_age_70_79,
                  atas_80: val.pdp_age_atas_80,
                },
                otg_proses: val.otg_proses,
                otg_selesai: val.otg_selesai,
                otg_total: val.otg_total,
                otg_by_gender: {
                  laki_laki: val.otg_lakilaki,
                  perempuan: val.otg_perempuan,
                },
                otg_by_usia: {
                  bawah_5: val.otg_age_bawah_5,
                  "6_19": val.otg_age_6_19,
                  "20_29": val.otg_age_20_29,
                  "30_39": val.otg_age_30_39,
                  "40_49": val.otg_age_40_49,
                  "50_59": val.otg_age_50_59,
                  "60_69": val.otg_age_60_69,
                  "70_79": val.otg_age_70_79,
                  atas_80: val.otg_age_atas_80,
                },
                positif_aktif_proses: val.positif_aktif_proses,
                positif_aktif_selesai: val.positif_aktif_selesai,
                positif_aktif_total: val.positif_aktif_total,
                positif_aktif_by_gender: {
                  laki_laki: val.positif_aktif_lakilaki,
                  perempuan: val.positif_aktif_perempuan,
                },
                positif_aktif_by_usia: {
                    bawah_5: val.positif_aktif_bawah_5,
                    "6_19": val.positif_aktif_6_19,
                    "20_29": val.positif_aktif_20_29,
                    "30_39": val.positif_aktif_30_39,
                    "40_49": val.positif_aktif_40_49,
                    "50_59": val.positif_aktif_50_59,
                    "60_69": val.positif_aktif_60_69,
                    "70_79": val.positif_aktif_70_79,
                    atas_80: val.positif_aktif_atas_80,
                },
                positif_sembuh_proses: val.positif_sembuh_proses,
                positif_sembuh_selesai: val.positif_sembuh_selesai,
                positif_sembuh_total: val.positif_sembuh_total,
                positif_sembuh_by_gender: {
                  laki_laki: val.positif_sembuh_lakilaki,
                  perempuan: val.positif_sembuh_perempuan,
                },
                positif_sembuh_by_usia: {
                  bawah_5: val.positif_sembuh_bawah_5,
                  "6_19": val.positif_sembuh_6_19,
                  "20_29": val.positif_sembuh_20_29,
                  "30_39": val.positif_sembuh_30_39,
                  "40_49": val.positif_sembuh_40_49,
                  "50_59": val.positif_sembuh_50_59,
                  "60_69": val.positif_sembuh_60_69,
                  "70_79": val.positif_sembuh_70_79,
                  atas_80: val.positif_sembuh_atas_80,
                },
                positif_meninggal_proses: val.positif_meninggal_proses,
                positif_meninggal_selesai: val.positif_meninggal_selesai,
                positif_meninggal_total: val.positif_meninggal_total,
                positif_meninggal_by_gender: {
                  laki_laki: val.positif_meninggal_lakilaki,
                  perempuan: val.positif_meninggal_perempuan,
                },
                positif_meninggal_by_usia: {
                  bawah_5: val.positif_meninggal_bawah_5,
                  "6_19": val.positif_meninggal_6_19,
                  "20_29": val.positif_meninggal_20_29,
                  "30_39": val.positif_meninggal_30_39,
                  "40_49": val.positif_meninggal_40_49,
                  "50_59": val.positif_meninggal_50_59,
                  "60_69": val.positif_meninggal_60_69,
                  "70_79": val.positif_meninggal_70_79,
                  atas_80: val.positif_meninggal_atas_80,
                },
                // positif_proses: val.positif_proses,
                // positif_selesai: val.positif_selesai,
                wni_total: val.wni_total,
                wna_total: val.wna_total,
                grand_total: val.grand_total,
              })
           }//endif
        })
    })
    
    let output ={
      summary : combine_data,
      total: {
        odp_proses: sum_odp_proses,
        odp_selesai: sum_odp_selesai,
        odp_total: sum_odp_total,
        odp_by_gender: {
          laki_laki: sum_odp_lakilaki,
          perempuan: sum_odp_perempuan
        },
        odp_by_usia: {
          bawah_5: sum_odp_age_bawah_5,
          "6_19": sum_odp_age_6_19,
          "20_29": sum_odp_age_20_29,
          "30_39": sum_odp_age_30_39,
          "40_49": sum_odp_age_40_49,
          "50_59": sum_odp_age_50_59,
          "60_69": sum_odp_age_60_69,
          "70_79": sum_odp_age_70_79,
          atas_80: sum_odp_age_atas_80,
        },
        pdp_proses: sum_pdp_proses,
        pdp_selesai: sum_pdp_selesai,
        pdp_total: sum_pdp_total,
        pdp_by_gender: {
          laki_laki: sum_pdp_lakilaki,
          perempuan: sum_pdp_perempuan
        },
        pdp_by_usia: {
          bawah_5: sum_pdp_age_bawah_5,
          "6_19": sum_pdp_age_6_19,
          "20_29": sum_pdp_age_20_29,
          "30_39": sum_pdp_age_30_39,
          "40_49": sum_pdp_age_40_49,
          "50_59": sum_pdp_age_50_59,
          "60_69": sum_pdp_age_60_69,
          "70_79": sum_pdp_age_70_79,
          atas_80: sum_pdp_age_atas_80,
        },
        otg_proses: sum_otg_proses,
        otg_selesai: sum_otg_selesai,
        otg_total: sum_otg_total,
        otg_by_gender: {
          laki_laki: sum_otg_lakilaki,
          perempuan: sum_otg_perempuan
        },
        otg_by_usia: {
          bawah_5: sum_otg_age_bawah_5,
          "6_19": sum_otg_age_6_19,
          "20_29": sum_otg_age_20_29,
          "30_39": sum_otg_age_30_39,
          "40_49": sum_otg_age_40_49,
          "50_59": sum_otg_age_50_59,
          "60_69": sum_otg_age_60_69,
          "70_79": sum_otg_age_70_79,
          atas_80: sum_otg_age_atas_80,
        },
        positif_aktif_proses: sum_positif_aktif_proses,
        positif_aktif_selesai: sum_positif_aktif_selesai,
        positif_aktif_total: sum_positif_aktif_total,
        positif_aktif_by_gender: {
          laki_laki: sum_positif_aktif_lakilaki,
          perempuan: sum_positif_aktif_perempuan
        },
        positif_aktif_by_usia: {
           bawah_5: sum_positif_aktif_bawah_5,
           "6_19": sum_positif_aktif_6_19,
           "20_29": sum_positif_aktif_20_29,
           "30_39": sum_positif_aktif_30_39,
           "40_49": sum_positif_aktif_40_49,
           "50_59": sum_positif_aktif_50_59,
           "60_69": sum_positif_aktif_60_69,
           "70_79": sum_positif_aktif_70_79,
           atas_80: sum_positif_aktif_atas_80,
         },
        positif_sembuh_proses: sum_positif_sembuh_proses,
        positif_sembuh_selesai: sum_positif_sembuh_selesai,
        positif_sembuh_total: sum_positif_sembuh_total,
        positif_sembuh_by_gender: {
          laki_laki: sum_positif_sembuh_lakilaki,
          perempuan: sum_positif_sembuh_perempuan
        },
        positif_sembuh_by_usia: {
          bawah_5: sum_positif_sembuh_bawah_5,
          "6_19": sum_positif_sembuh_6_19,
          "20_29": sum_positif_sembuh_20_29,
          "30_39": sum_positif_sembuh_30_39,
          "40_49": sum_positif_sembuh_40_49,
          "50_59": sum_positif_sembuh_50_59,
          "60_69": sum_positif_sembuh_60_69,
          "70_79": sum_positif_sembuh_70_79,
          atas_80: sum_positif_sembuh_atas_80,
        },
        positif_meninggal_proses: sum_positif_meninggal_proses,
        positif_meninggal_selesai: sum_positif_meninggal_selesai,
        positif_meninggal_total: sum_positif_meninggal_total,
        positif_meninggal_by_gender: {
          laki_laki: sum_positif_meninggal_lakilaki,
          perempuan: sum_positif_meninggal_perempuan
        },
        positif_meninggal_by_usia: {
          bawah_5: sum_positif_meninggal_bawah_5,
          "6_19": sum_positif_meninggal_6_19,
          "20_29": sum_positif_meninggal_20_29,
          "30_39": sum_positif_meninggal_30_39,
          "40_49": sum_positif_meninggal_40_49,
          "50_59": sum_positif_meninggal_50_59,
          "60_69": sum_positif_meninggal_60_69,
          "70_79": sum_positif_meninggal_70_79,
          atas_80: sum_positif_meninggal_atas_80,
        },
        // positif_proses: sum_positif_proses,
        // positif_selesai: sum_positif_selesai,
        wni_total : sum_wni_total,
        wna_total : sum_wna_total,
        grand_total: sum_grand_total,
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

const lapHarianExport = async (query, user, callback) => {
  try {
    let querySummary = await Sql.summaryAgregatePerDinkes(user, query)
    let result = await Case.aggregate(querySummary)

    let getKabkotaCodeAndName = []
   
    if (user.role ==="dinkeskota") {
      //  let kab_kota = await SubDistrict.find({'kemendagri_kabupaten_kode': user.code_district_city})
        let name_group ="Kecamatan"
        let kab_kota = await SubDistrict.find()
         kab_kota.forEach((val, key) => {
           getKabkotaCodeAndName.push({
             kab_kota: val.kemendagri_kecamatan_kode,
             kab_kota_name: val.kemendagri_kecamatan_nama
           })
         })
    } else if (user.role === "dinkesprov" || user.role === "superadmin") {
        let name_group = "Kabupaten/Kota"
        let kab_kota = await DistrictCity.find({'kemendagri_provinsi_kode':'32'})
        kab_kota.forEach((val, key) => {
          getKabkotaCodeAndName.push({
            kab_kota: val.kemendagri_kabupaten_kode,
            kab_kota_name: val.kemendagri_kabupaten_nama
          })
        })
    }


    let combine_data = []
    result.forEach((val, key) =>{

        getKabkotaCodeAndName.forEach((val1,key1) =>{
            if (val.kab_kota === val1.kab_kota) {
                combine_data.push({
                  kotkabkec: val1.kab_kota_name,
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
    
    // let output ={
    //   summary : combine_data,
    //   total: {
    //     sum_odp_proses: sum_odp_proses,
    //     sum_odp_selesai: sum_odp_selesai,
    //     sum_odp_total: sum_odp_total,
    //     sum_pdp_proses: sum_pdp_proses,
    //     sum_pdp_selesai: sum_pdp_selesai,
    //     sum_pdp_total: sum_pdp_total,
    //     sum_otg_proses: sum_otg_proses,
    //     sum_otg_selesai: sum_otg_selesai,
    //     sum_otg_total: sum_otg_total,
    //     sum_positif_aktif_proses: sum_positif_aktif_proses,
    //     sum_positif_aktif_selesai: sum_positif_aktif_selesai,
    //     sum_positif_aktif_total: sum_positif_aktif_total,
    //     sum_positif_sembuh_proses: sum_positif_sembuh_proses,
    //     sum_positif_sembuh_selesai: sum_positif_sembuh_selesai,
    //     sum_positif_sembuh_total: sum_positif_sembuh_total,
    //     sum_positif_meninggal_proses: sum_positif_meninggal_proses,
    //     sum_positif_meninggal_selesai: sum_positif_meninggal_selesai,
    //     sum_positif_meninggal_total: sum_positif_meninggal_total,
    //     sum_positif_proses: sum_positif_proses,
    //     sum_positif_selesai: sum_positif_selesai,
    //     sum_grand_total: sum_grand_total,
    //   }
    // }  
    return callback(null, combine_data)
  } catch (error) {
    callback(error, null)
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
  {
    name: "services.dashboard.lapHarianExport",
    method: lapHarianExport
  }
]