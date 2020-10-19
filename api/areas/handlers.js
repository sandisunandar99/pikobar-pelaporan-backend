const { replyJson } = require('../helpers')

/**
 * GET /api/areas/district-city
 */
const DistrictCity = (server) => {
  return (request, reply) => {
    server.methods.services.areas.getDistrictCity(
      request.query,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

/**
 * GET /areas/sub-district/{city_code}
 */
const SubDistrict = (server) => {
  return (request, reply) => {
    server.methods.services.areas.getSubDistrictDetail(
      request.params.city_code,
      (err, districs) => {
        replyJson(err, districs, reply)
      }
    )
  }
}

/**
 * GET /api/sub-district-detail/{id}
 */
const SubDistrictDetail = (server) => {
  return (request, reply) => {
    server.methods.services.areas.getDistrictCity(
      request.query,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

/**
 * GET /api/areas/village/{district_code}
 */
const Village = (server) => {
  return (request, reply) => {
    server.methods.services.areas.getVillage(
      request.params.district_code,
      request.query,
      (err, districs) => {
        replyJson(err, districs, reply)
      }
    )
  }
}

/**
 * GET /api/village-detail/{id}
 */
const VillageDetail = (server) => {
  return (request, reply) => {
    server.methods.services.areas.getVillageDetail(
      request.params.village_code,
      (err, districs) => {
        replyJson(err, districs, reply)
      }
    )
  }
}

/**
 * GET /api/areas/hospital
 */
const Hospital = (server) => {
  return (request, reply) => {
    server.methods.services.areas.getHospital(
      request.query,
      (err, hospital) => {
        replyJson(err, hospital, reply)
      }
    )
  }
}

/**
 * GET /api/areas/lab
 */
const Lab = (server) => {
  return (request, reply) => {
    server.methods.services.areas.getLab(
      request.query,
      (err, hospital) => {
        replyJson(err, hospital, reply)
      }
    )
  }
}

/**
 * GET /api/area/province
 */
const getProvince = (server) => {
  return (request, reply) => {
    server.methods.services.areas.province(
      request.query,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

module.exports = {
  DistrictCity, SubDistrict, SubDistrictDetail, Village,
  VillageDetail, Hospital, Lab, getProvince
}