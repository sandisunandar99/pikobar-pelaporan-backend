const { replyJson } = require('../helpers')
const { funcIfSame, queryIfSame, queryParamSame } = require('../../helpers/request')

/**
 * GET /api/areas/district-city
 */
const DistrictCity = (server) => {
  return async (request, reply) => {
    await queryIfSame(
      server, "areas", "getDistrictCity",
      request, reply, replyJson
    )
  }
}

/**
 * GET /areas/sub-district/{city_code}
 */
const SubDistrict = (server) => {
  return async (request, reply) => {
    await queryParamSame(
      server, "areas", "getSubDistrict",
      request, "city_code", reply, replyJson
    )
  }
}

/**
 * GET /api/sub-district-detail/{id}
 */
const SubDistrictDetail = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, "areas", "getSubDistrictDetail",
      request, "sub_district_code", reply, replyJson
    )
  }
}

/**
 * GET /api/areas/village/{district_code}
 */
const Village = (server) => {
  return async (request, reply) => {
    await queryParamSame(
      server, "areas", "getVillage",
      request, "district_code", reply, replyJson
    )
  }
}

/**
 * GET /api/village-detail/{id}
 */
const VillageDetail = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, "areas", "getVillageDetail",
      request, "village_code", reply, replyJson
    )
  }
}

/**
 * GET /api/areas/hospital
 */
const Hospital = (server) => {
  return async (request, reply) => {
    await queryIfSame(
      server, "areas", "getHospital",
      request, reply, replyJson
    )
  }
}

/**
 * GET /api/areas/lab
 */
const Lab = (server) => {
  return async (request, reply) => {
    await queryIfSame(
      server, "areas", "getLab",
      request, reply, replyJson
    )
  }
}

/**
 * GET /api/area/province
 */
const getProvince = (server) => {
  return async (request, reply) => {
    await queryIfSame(
      server, "areas", "province",
      request, reply, replyJson
    )
  }
}

module.exports = {
  DistrictCity, SubDistrict, SubDistrictDetail, Village,
  VillageDetail, Hospital, Lab, getProvince
}