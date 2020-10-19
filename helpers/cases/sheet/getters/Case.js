const conf = require('../config.json')
const { _toString, _toDateString, _toUnsignedInt, getStringValueByIndex } = require('../helper')

const getIdCaseNational = (d) => {
  return _toString(d[conf.cell.id_case_national])
}

const getIdCaseRelated = (d) => {
  return null
}

const getNameCaseRelated = (d) => {
  if (!d[conf.cell.id_case_related]) return null
  if (!_toString(d[conf.cell.id_case_related].split)) return null
  return _toString(d[conf.cell.id_case_related].split('|')[1] || null)
}

const getName = (d) => {
  return _toString(d[conf.cell.name]) || undefined
}

const getNik = (d) => {
  return _toString(d[conf.cell.nik]) || null
}

const getBirthDate = (d) => {
  return _toDateString(d[conf.cell.birth_date])
}

const getAge = (d) => {
  if (d[conf.cell.age] === '' || d[conf.cell.age] === null) return null
  let age = _toUnsignedInt(d[conf.cell.age]) || '0'
  return _toString(age)
}

const getGender = (d) => {
  const gender = d[conf.cell.gender]
  if (gender) {
    return gender == 'Perempuan' ? 'P' : 'L'
  }
  return gender
}

const getPhoneNumber = (d) => {
  return _toString(d[conf.cell.phone_number])
}

const getAddressStreet = (d) => {
  return _toString(d[conf.cell.address_street])
}

const getAddressProvinceCode = (d) => {
  return '32'
}

const getAddressProvinceName = (d) => {
  return 'Jawa Barat'
}

const getAddressDistrictCode = (d) => {
  return getStringValueByIndex(d[conf.cell.address_district_code], 1)

}

const getAddressDistrictName = (d) => {
  return getStringValueByIndex(d[conf.cell.address_district_code], 0)
}

const getAddressSubdistrictCode = (d) => {
  return getStringValueByIndex(d[conf.cell.address_subdistrict_code], 1)
}


const getAddressSubdistrictName = (d) => {
  return getStringValueByIndex(d[conf.cell.address_subdistrict_code], 0)

}

const getAddressVillageCode = (d) => {
  return getStringValueByIndex(d[conf.cell.address_village_code], 1)
}

const getAddressVillageName = (d) => {
  return getStringValueByIndex(d[conf.cell.address_village_code], 0)
}

const getNationality = (d) => {
  return _toString(d[conf.cell.nationality]) || undefined
}

const getNationalityName = (d) => {
  return _toString(d[conf.cell.nationality_name])
}

const getOccupation = (d) => {
  return _toString(d[conf.cell.occupation])
}

const getOfficeAddress = (d) => {
  return _toString(d[conf.cell.office_address])
}

module.exports = {
  // init,
  getIdCaseNational,
  getIdCaseRelated,
  getNameCaseRelated,
  getName,
  getNik,
  getBirthDate,
  getAge,
  getGender,
  getPhoneNumber,
  getAddressStreet,
  getAddressProvinceCode,
  getAddressProvinceName,
  getAddressDistrictCode,
  getAddressDistrictName,
  getAddressSubdistrictCode,
  getAddressSubdistrictName,
  getAddressVillageCode,
  getAddressVillageName,
  getNationality,
  getNationalityName,
  getOccupation,
  getOfficeAddress,
}
