const Rdt = require('../models/Rdt')
const DistrictCity = require('../models/DistrictCity')
const Case = require('../models/Case')
const { getLastRdtNumber } = require('../helpers/rdt/custom')
const LocationTest = require('../models/LocationTest')

function getCountRdtCode(code, callback) {
  DistrictCity.findOne({ kemendagri_kabupaten_kode: code })
    .exec()
    .then(dinkes => {
      Rdt.find({ address_district_code: code })
        .sort({ code_test: -1 })
        .exec()
        .then(res => {
          let count = getLastRdtNumber(1, res, 10);
          let result = {
            prov_city_code: code,
            dinkes_code: dinkes.dinkes_kota_kode,
            count: count
          }
          return callback(null, result)
        }).catch(err => callback(err, null))
    })
}

function FormSelectIdCase(query, user, data_pendaftaran, callback) {
  let params = new Object();

  if (query.address_district_code) {
    params.author_district_code = query.address_district_code;
  }

  Case.find(params)
    .where('delete_status')
    .ne('deleted')
    .or([{ name: new RegExp(query.search, "i") },
    { nik: new RegExp(query.search, "i") },
    { phone_number: new RegExp(query.search, "i") }])
    .exec()
    .then(x => {
      let res = x.map(res => res.JSONFormCase())
      let concat = res.concat(data_pendaftaran)
      return callback(null, concat)
    })
    .catch(err => callback(err, null))
}


async function getLocationTest(callback) {
  try {
    const result = await LocationTest.find({})
    const mapingResult = result.map(x => x.toJSONFor())
    callback(null, mapingResult)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.rdt_others.getCountRdtCode',
    method: getCountRdtCode
  },
  {
    name: 'services.rdt_others.FormSelectIdCase',
    method: FormSelectIdCase
  },
  {
    name: 'services.rdt_others.getLocationTest',
    method: getLocationTest
  },
]