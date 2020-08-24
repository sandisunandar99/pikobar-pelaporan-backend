'use strict'
const check = require('../rolecheck')
const filter = require('../filter/casefilter')
const { WHERE_GLOBAL, CRITERIA} = require('../constant')

const aggregateCondition = async (user, query) => {
  const search = check.countByRole(user)
  const filters = await filter.filterCase(user, query)
  const searching = {...search, ...filters, ...WHERE_GLOBAL }
  return [
    {
      $match: {
        $and: [ searching ]
      }
    }, {
      $lookup:
      {
        from: 'districtgeos',
        localField: 'address_village_code',
        foreignField: 'kemendagri_desa_kode',
        as: 'geolocation'
      }
    }, { $unwind: '$geolocation' },
    {
      "$project": {
        "_id": 1,
        "id": "$id_case",
        "kode_kab": "$address_district_code",
        "nama_kab": "$address_district_name",
        "kode_kec": "$address_subdistrict_code",
        "nama_kec": "$address_subdistrict_name",
        "kode_kel": "$address_village_code",
        "nama_kel": "$address_village_name",
        "status": "$status",
        "umur": "$age",
        "gender": "$gender",
        "final_result": "$final_result",
        "tanggal_konfirmasi": "$createdAt",
        "tanggal_update": "$updatedAt",
        "longitude" : "$geolocation.latitude",
        "latitude" : "$geolocation.longitude"
      }
    }
  ]
}
const filterDefault = (query) => {
  let queryStrings;
  if (query.status_patient) {
    const splits = query.status_patient.split('-');
    if (splits[0] == CRITERIA.CONF && splits[1] !== "3") {
      queryStrings = { "status": splits[0], "final_result": splits[1] }
    } else if (splits[0] == CRITERIA.CONF && splits[1] == "3") {
      queryStrings = { "status": splits[0] }
    } else if (query.status_patient == "all") {
      queryStrings = {};
    } else {
      queryStrings = { "status": splits[0], "stage": splits[1] }
    }
  } else {
    queryStrings = {
      "status": CRITERIA.CONF,
      "final_result": { "$in": [null, "", "0"] }
    };
  }
  return queryStrings;
}

module.exports = {
  filterDefault, aggregateCondition
}