const Districtcity = require('../models/DistrictCity')
const SubDistrict = require('../models/SubDistrict')
const Village = require('../models/Village')
const Unit = require('../models/Unit')
const Lab = require('../models/Lab')
const Province = require('../models/Province')
const { findWithSort } = require('../utils/index')
const { clientConfig } = require('../config/redis')
const sameCondition = async (schema, condition, sort) => {
  return await schema.find(condition).sort(sort)
}

const condition = (kecamatan_kode) => {
  return {
    'where': { kemendagri_kecamatan_kode : kecamatan_kode },
    'sort': { kemendagri_kecamatan_nama : 'asc' }
  }
}

const getDistrictCity = async (request, callback) => {
  let params = new Object()
  if (request.kota_kode) params.kemendagri_kabupaten_kode = request.kota_kode
  if (request.provice_code) params.kemendagri_provinsi_kode = request.provice_code
  if (!request.status) params.kemendagri_provinsi_kode = '32'
  if (request.kemendagri_provinsi_nama) {
    params.kemendagri_provinsi_nama = request.kemendagri_provinsi_nama.toUpperCase()
  }
  const key = `district-city`
  const expireTime = 1440 * 60 * 1000 // 24 hours expire
  try {
    clientConfig.get(key, async (err, result) => {
      if(result){
        callback(null, JSON.parse(result))
        console.info('redis source district-city')
      }else{
        const res = await Districtcity.find(params).sort({ kemendagri_kabupaten_nama: 'asc' })
        const resMap = res.map(res => res.toJSONFor())
        clientConfig.setex(key, expireTime, JSON.stringify(resMap)) // set redis key
        callback(null, resMap)
        console.info('api source district-city')
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

const getSubDistrict = async (city_code, request, callback) => {
  let params = {}
  params.kemendagri_kabupaten_kode = city_code;

  if (request.kecamatan_kode) {
    params.kemendagri_kecamatan_kode = request.kecamatan_kode
  }

  try {
    const sort = { kemendagri_kecamatan_nama: 'asc' }
    await findWithSort(SubDistrict, params, sort, callback)
  } catch (error) {
    callback(error, null)
  }
}

const getSubDistrictDetail = async (kecamatan_kode, callback) => {
  try {
    const { where, sort } = condition(kecamatan_kode)
    const res = await sameCondition(SubDistrict, where, sort)
    callback(null, res.map(res => res.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
}

const getVillage = async (kecamatan_code, request, callback) => {
  let params = new Object()
  params.kemendagri_kecamatan_kode = kecamatan_code

  if (request.desa_kode) {
    params.kemendagri_desa_kode = request.desa_kode
  }

  const sort = { kemendagri_desa_nama: 'asc' }
  try {
    await findWithSort(Village, params, sort, callback)
  } catch (error) {
    callback(error, null)
  }
}

const getVillageDetail = async (desa_kode, callback) => {
  try {
    const condition = { kemendagri_desa_kode: desa_kode }
    const sort = { kemendagri_desa_nama: 'asc' }
    const res = await sameCondition(Village, condition, sort)
    callback(null, res.map(res => res.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
}

const getHospital = async (query, callback) => {
  let params = new Object()
  if (query.search) params.name = new RegExp(query.search, "i")
  if (query.city_code) params.kemendagri_kabupaten_kode = query.city_code
  if (query.rs_jabar) {
    params.rs_jabar = query.rs_jabar === 'true'
  }
  try {
    const expireTime = 1440 * 60 * 1000 // 24 hours expire
    const key = `hospital-${params.rs_jabar}`
    clientConfig.get(key, async (err, result) => {
      if(result){
        const resultJSON = JSON.parse(result)
        callback(null, resultJSON)
        console.info(`redis source ${key}`)
      }else{
        const res = await Unit.find(Object.assign(params, { unit_type: 'rumahsakit' }))
        clientConfig.setex(key, expireTime, JSON.stringify(res)) // set redis key
        callback(null, res)
        console.info(`api source ${key}`)
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

const mergeHospitalLab = async (query, callback) => {
  try {
    let params = true
    if (query.rs_jabar) {
      params = query.rs_jabar === 'true'
    }
    const resLab = await Lab.find()
    const resUnit = await Unit.find({ rs_jabar:params, unit_type: 'rumahsakit' })
    const res = [...resUnit,...resLab.map((r) => r.toJSONFor())]
    callback(null, res)
  } catch (error) {
    callback(error, null)
  }
}

const getLab = async (query, callback) => {
  var params = new Object();

  if (query.search) {
    params.lab_name = new RegExp(query.search, "i")
  }

  try {
    const res = await Lab.find(params)
    callback(null, res.map(res => res.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
}

const province = async(query, callback) =>{
  try {
    const result = await Province.find({})
    callback(null, result.map(x => x.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
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
  },
  {
    name: 'services.areas.getLab',
    method: getLab
  },
  {
    name: 'services.areas.province',
    method: province
  },{
    name: 'services.areas.mergeHospitalLab',
    method: mergeHospitalLab
  },
]
