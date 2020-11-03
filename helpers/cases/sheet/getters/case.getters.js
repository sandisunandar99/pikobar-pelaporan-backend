const conf = require('../config.json')
const {
  refApd, refHealthWorkers, refTransmissionType, refClusterType, refIncomes,
} = require('../reference')
const {
  _toString, _toDateString, _toUnsignedInt, getStringValueByIndex, getTransformedAge, trueOrFalse, findReference, getArrayValues,
} = require('../helper')

// import attributes
const {
  getTravelingType, getTravelingVisited, getTravelingCity, getTravelingDate, getTravelingArrive,
} = require('./attributes/traveling_history')
const {
  getInspectionType, getSpecienType, getInspectionDate, getInspectionLocation, getSpecimenTo, getInspectionResult,
} = require('./attributes/inspection_support')
const {
  getPublicPlaceCategory, getPublicPlaceName, getPublicPlaceAddress, getPublicPlaceDateVisited, getPublicPlaceDurationVisited
} = require('./attributes/visited_public_place')
const {
  getVisitedLocalAreaProvince, getVisitedLocalAreaCity,
} = require('./attributes/visited_local_area')

const getters = {}

getters.getNum = (d) => {
  return _toString(d[conf.cell.num])
}

getters.getInterviewerName = (d) => {
  return _toString(d[conf.cell.interviewers_name]) || undefined
}

getters.getInterviewerPhoneNumber = (d) => {
  return _toString(d[conf.cell.interviewers_phone_number]) || undefined
}

getters.getInterviewDate = (d) => {
  return _toString(d[conf.cell.interview_date]) || undefined
}

getters.isNikExists = (d) => {
  return !!getters.getNik(d)
}

getters.getNik = (d) => {
  return _toString(d[conf.cell.nik]) || undefined
}

getters.getNikNote = (d) => {
  return _toString(d[conf.cell.note_nik]) || undefined
}

getters.isPhoneNumberExists = (d) => {
  return !!getters.getPhoneNumber(d)
}

getters.getPhoneNumber = (d) => {
  return _toString(d[conf.cell.phone_number])
}

getters.getPhoneNumberNote = (d) => {
  return _toString(d[conf.cell.note_phone_number])
}

getters.getName = (d) => {
  return _toString(d[conf.cell.name]) || undefined
}

getters.getNameParent = (d) => {
  return _toString(d[conf.cell.name_parents]) || undefined
}

getters.getPlaceOfBirth = (d) => {
  return _toString(d[conf.cell.place_of_birth]) || undefined
}

getters.getBirthDate = (d) => {
  return _toDateString(d[conf.cell.birth_date])
}

getters.getAge = (d) => {
  return getTransformedAge(d[conf.cell.age])
}

getters.getAgeMonth = (d) => {
  return getTransformedAge(d[conf.cell.month])
}

getters.getGender = (d) => {
  const gender = d[conf.cell.gender]
  if (gender) {
    return gender == 'Perempuan' ? 'P' : 'L'
  }
  return gender
}

getters.getAddressProvinceCode = (d) => {
  return '32'
}

getters.getAddressProvinceName = (d) => {
  return 'Jawa Barat'
}

getters.getAddressDistrictCode = (d) => {
  return getStringValueByIndex(d[conf.cell.address_district_code], 1)
}

getters.getAddressDistrictName = (d) => {
  return getStringValueByIndex(d[conf.cell.address_district_code], 0)
}

getters.getAddressSubdistrictCode = (d) => {
  return getStringValueByIndex(d[conf.cell.address_subdistrict_code], 1)
}


getters.getAddressSubdistrictName = (d) => {
  return getStringValueByIndex(d[conf.cell.address_subdistrict_code], 0)

}

getters.getAddressVillageCode = (d) => {
  return getStringValueByIndex(d[conf.cell.address_village_code], 1)
}

getters.getAddressVillageName = (d) => {
  return getStringValueByIndex(d[conf.cell.address_village_code], 0)
}

getters.getAddressRT = (d) => {
  return _toUnsignedInt(d[conf.cell.rt])
}

getters.getAddressRW = (d) => {
  return _toUnsignedInt(d[conf.cell.rw])
}

getters.getAddressStreet = (d) => {
  return _toString(d[conf.cell.address_street])
}

getters.getOccupation = (d) => {
  return _toString(d[conf.cell.occupation])
}

getters.getOfficeAddress = (d) => {
  return _toString(d[conf.cell.office_address])
}

getters.getNationality = (d) => {
  return _toString(d[conf.cell.nationality]) || undefined
}

getters.getNationalityName = (d) => {
  return _toString(d[conf.cell.nationality_name])
}

getters.getIncome = (d) => {
  return findReference(refIncomes, d[conf.cell.income])
}

getters.getInspectionSupport = (d) => {
  const inspection_support = {
    inspection_type: getInspectionType(d),
    specimens_type: getSpecienType(d),
    inspection_date: getInspectionDate(d),
    inspection_location: getInspectionLocation(d),
    get_specimens_to: getSpecimenTo(d),
    inspection_result: getInspectionResult(d),
  }
  return [ inspection_support ]
}

getters.getTravelingHistory = (d) => {
  const traveling_history = {
    travelling_type: getTravelingType(d),
    travelling_visited: getTravelingVisited(d),
    travelling_city: getTravelingCity(d),
    travelling_date: getTravelingDate(d),
    travelling_arrive: getTravelingArrive(d),
  }
  return [ traveling_history ]
}

getters.getVisitedLocalArea = (d) => {
  const visited_local_area = {
    visited_local_area_province: getVisitedLocalAreaProvince(d),
    visited_local_area_city: getVisitedLocalAreaCity(d),
  }
  return [ visited_local_area ]
}

getters.getVisitedPublicPlace = (d) => {
  return[{
    public_place_category: getPublicPlaceCategory(d),
    public_place_name: getPublicPlaceName(d),
    public_place_address: getPublicPlaceAddress(d),
    public_place_date_visited: getPublicPlaceDateVisited(d),
    public_place_duration_visited: getPublicPlaceDurationVisited(d),
  }]
}

getters.getTransmissionType = (d) => {
  return findReference(refTransmissionType, d[conf.cell.transmission_type])
}

getters.getClusterType = (d) => {
  return findReference(refClusterType, d[conf.cell.cluster_type])
}

getters.getClusterOther = (d) => {
  return _toString(d[conf.cell.cluster_other])
}

getters.isCloseContactHeavyIspaGroup = (d) => {
  return trueOrFalse(d[conf.cell.close_contact_heavy_ispa_group])
}

getters.isCloseContactHavePets = (d) => {
  return !!getters.getCloseContactPets(d)
}

getters.getCloseContactPets = (d) => {
  return _toString(d[conf.cell.close_contact_pets])
}

getters.isCloseContactHealthWorker = (d) => {
  return !!getters.getHealthWorker(d)
}

getters.getHealthWorker = (d) => {
  return findReference(refHealthWorkers, d[conf.cell.health_workers])
}

getters.getApdUse = (d) => {
  const apdUse = getArrayValues(refApd, _toString(d[conf.cell.apd_use]))
  return apdUse.registered
}

getters.isCloseContactPerformingAerosol = (d) => {
  return !!getters.getCloseContactPerformingAerosol(d)
}

getters.getCloseContactPerformingAerosol = (d) => {
  return _toString(d[conf.cell.close_contact_performing_aerosol])
}

module.exports = getters
