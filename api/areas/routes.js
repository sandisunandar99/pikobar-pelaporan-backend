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
      config: configRoute("show districs in west java areas", "areas", CheckRoleView),
      handler: handlers.SubDistrict(server)
    },
    {
      method: 'GET',
      path: '/areas/sub-district-detail/{sub_district_code}',
      config: configRoute("show sub districs detail", "areas", CheckRoleView),
      handler: handlers.SubDistrictDetail(server)
    },
    {
      method: 'GET',
      path: '/areas/village/{district_code}',
      config: configRoute("show villege in west java areas", "areas", CheckRoleView),
      handler: handlers.Village(server)
    },
    {
      method: 'GET',
      path: '/areas/village-detail/{village_code}',
      config: configRoute("show villege detail", "areas", CheckRoleView),
      handler: handlers.VillageDetail(server)
    },
    {
      method: 'GET',
      path: '/areas/hospital',
      config: configRoute("show hospitals in west java", "areas", CheckRoleView),
      handler: handlers.Hospital(server)
    },
    {
      method: 'GET',
      path: '/areas/lab',
      config: configRoute("show lab in west java", "areas", CheckRoleView),
      handler: handlers.Lab(server)
    },
    {
      method: 'GET',
      path: '/areas/province',
      config: configRoute("show west java", "areas", CheckRoleView),
      handler: handlers.getProvince(server)
    },
    {
      method: 'GET',
      path: '/areas/list-unit-lab',
      config: configRoute("show west java unit and lab", "areas", CheckRoleView),
      handler: handlers.getUnitLab(server)
    }
  ]
}