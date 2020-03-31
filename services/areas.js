const mongoose = require('mongoose')

require('../models/DistrictCity')
require('../models/SubDistrict')
require('../models/Village')
require('../models/Hospital')

const Districtcity = mongoose.model('Districtcity')
const SubDistrict = mongoose.model('SubDistrict')
const Village = mongoose.model('Village')
const Hospital = mongoose.model('Hospital')


function getDistrictCity(request, callback) {
  var params = new Object();
  params.kemendagri_provinsi_kode = "32";

  if (request.kota_kode) {
    params.kemendagri_kabupaten_kode= request.kota_kode;
  }

  Districtcity.find(params)
    .sort({kemendagri_kabupaten_nama: 'asc'})
    .exec()
    .then(city => {
        let res = city.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function getSubDistrict(city_code, request, callback) {
  var params = new Object();
  params.kemendagri_kabupaten_kode = city_code;

  if (request.kecamatan_kode) {
       params.kemendagri_kecamatan_kode = request.kecamatan_kode
  }

  SubDistrict.find(params)
    .sort({ kemendagri_kecamatan_nama: 'asc' })
    .exec()
    .then(distric => {
        let res = distric.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function getSubDistrictDetail(kecamatan_kode, callback) {
  console.log(kecamatan_kode)
  SubDistrict.find({ kemendagri_kecamatan_kode: kecamatan_kode})
    .sort({ kemendagri_kecamatan_nama: 'asc' })
    .exec()
    .then(distric => {
        let res = distric.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function getVillage(kecamatan_code, request, callback) {
  var params = new Object();
  params.kemendagri_kecamatan_kode = kecamatan_code;

  if (request.desa_kode) {
    params.kemendagri_desa_kode = request.desa_kode;
  }

  Village.find(params)
      .sort({ kemendagri_desa_nama: 'asc' })
      .exec()
      .then(vill => {
          let res = vill.map(q => q.toJSONFor())
          return callback(null, res)
      })
      .catch(err => callback(err, null))
}

function getVillageDetail(desa_kode, callback) {
  Village.find({ kemendagri_desa_kode: desa_kode })
      .sort({ kemendagri_desa_nama: 'asc' })
      .exec()
      .then(vill => {
          let res = vill.map(q => q.toJSONFor())
          return callback(null, res)
      })
      .catch(err => callback(err, null))
}

function getHospital(query, callback) {
  let query_search = new RegExp(query.search, "i")
  Hospital.find({ name: query_search })
      .exec()
      .then(hsp => {
          let res = hsp.map(q => q.toJSONFor())
          return callback(null, res)
      })
      .catch(err => callback(err, null))

}


module.exports = [
  {
    name: 'services.areas.getDistrictCity',
    method: getDistrictCity
  },
  {
    name: 'services.areas.getSubDistrict',
    method: getSubDistrict
  },
  {
    name: 'services.areas.getSubDistrictDetail',
    method: getSubDistrictDetail
  },
  {
    name: 'services.areas.getVillage',
    method: getVillage
  },  
  {
    name: 'services.areas.getVillageDetail',
    method: getVillageDetail
  },
  {
    name: 'services.areas.getHospital',
    method: getHospital
  }
]
