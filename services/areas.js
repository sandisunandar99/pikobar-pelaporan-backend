const mongoose = require('mongoose')

require('../models/DistrictCity')
require('../models/SubDistrict')
require('../models/Village')
require('../models/Hospital')

const Districtcity = mongoose.model('Districtcity')
const SubDistrict = mongoose.model('SubDistrict')
const Village = mongoose.model('Village')
const Hospital = mongoose.model('Hospital')

function getDistrictCity(callback) {  
    Districtcity.find({ kemendagri_provinsi_kode: '32'})
        .sort({ kemendagri_kabupaten_kode: 'asc' })
        .exec()
        .then(city => {
            let res = city.map(q => q.toJSONFor())
            return callback(null, res)
        })
        .catch(err => callback(err, null))
}

function getSubDistrict(city_code,callback) {
    SubDistrict.find({ kemendagri_kabupaten_kode: city_code })
        .sort({ kemendagri_kecamatan_kode: 'asc' })
        .exec()
        .then(distric => {
            let res = distric.map(q => q.toJSONFor())
            return callback(null, res)
        })
        .catch(err => callback(err, null))
         
}

function getVillage(district_code,callback) {  
    Village.find({ kemendagri_kecamatan_kode: district_code })
        .sort({ kemendagri_desa_kode: 'asc' })
        .exec()
        .then(vill => {
            let res = vill.map(q => q.toJSONFor())
            return callback(null, res)
        })
        .catch(err => callback(err, null))   
             
}


function getHospital(query,callback) {
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
        name: 'services.areas.getVillage',
        method: getVillage
    },
    {
        name: 'services.areas.getHospital',
        method: getHospital
    }
]