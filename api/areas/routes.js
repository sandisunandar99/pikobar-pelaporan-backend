module.exports = (server) => {
  const handlers = require('./handlers')
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const { configRoute} = require("../../helpers/routes")
  return [
    {
      method: 'GET',
      path: '/areas/district-city',
      config: configRoute("show city in west java areas", "district-city", CheckRoleView),
      handler: handlers.DistrictCity(server)
    },
    {
      method: 'GET',
      path: '/areas/sub-district/{city_code}',
      config: configRoute("show districs in west java areas", "sub-district", CheckRoleView),
      handler: handlers.SubDistrict(server)
    },
    {
      method: 'GET',
      path: '/areas/sub-district-detail/{sub_district_code}',
      config: {
        auth: 'jwt',
        description: 'show sub districs detail',
        tags: ['api', 'areas'],
      },
      handler: handlers.SubDistrictDetail(server)
    },
    {
      method: 'GET',
      path: '/areas/village/{district_code}',
      config: {
        auth: 'jwt',
        description: 'show villege in west java areas',
        tags: ['api', 'areas'],
      },
      handler: handlers.Village(server)
    },
    {
      method: 'GET',
      path: '/areas/village-detail/{village_code}',
      config: {
        auth: 'jwt',
        description: 'show villege detail',
        tags: ['api', 'areas'],
      },
      handler: handlers.VillageDetail(server)
    },
    {
      method: 'GET',
      path: '/areas/hospital',
      config: {
        auth: 'jwt',
        description: 'get hospitals in west java',
        tags: ['api', 'areas'],
      },
      handler: handlers.Hospital(server)
    },
    {
      method: 'GET',
      path: '/areas/lab',
      config: {
        auth: 'jwt',
        description: 'get lab in west java',
        tags: ['api', 'areas'],
      },
      handler: handlers.Lab(server)
    },
    {
      method: 'GET',
      path: '/areas/province',
      config: {
        auth: 'jwt',
        description: 'get lab in west java',
        tags: ['api', 'areas'],
      },
      handler: handlers.getProvince(server)
    }
  ]
}