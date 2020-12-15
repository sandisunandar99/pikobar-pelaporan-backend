const {
    _toString, _toDateString, _toUnsignedInt, getStringValueByIndex, getTransformedAge, trueOrFalse, findReference, getArrayValues,
  yesNoUnknown,
} = require('../../../helpers/cases/sheet/helper')


const conf = require('./config.json')
const getters = {}

getters.getNum = (data) => {
  return _toString(data[conf.cell.num])
}

getters.getTarget = (data) => {
  const target = data[conf.cell.target]
  let _target

  switch (target) {
    case "Kontak Erat" || "KONTAK ERAT":
      _target = "CLOSECONTACT"
      break;
    case "Probable" || "PROBABLE":
      _target = "PROBABLE"
      break;
    case "Suspek" || "SUSPEK":
      _target = "SUSPECT"
      break;
    case "Konfirmasi" || "Terkonfirmasi" || "KONFIRMASI":
      _target = "CONFIRMATION"
      break;
    default:
      _target = "Lainnya"
      break;
  }
  return _target
}

getters.getcategory = (data)=> {
  return _toString(data[conf.cell.category])
}

getters.getName = (data) => {
  return _toString(data[conf.cell.name])
}

getters.getNik = (data) => {
  return _toString(data[conf.cell.nik]) || undefined
}

getters.getPhoneNumber = (data) => {
  return _toString(data[conf.cell.phone_number])
}

getters.getGender = (data) => {
  return _toString(data[conf.cell.gender])
}

getters.getAge = (data) => {
  return _toString(data[conf.cell.age])}

getters.getBirthDate = (data) => {
  if (isNaN(data[conf.cell.birth_date])) {
    return _toString(data[conf.cell.birth_date])
  }else{
    return _toDateString(data[conf.cell.birth_date])
  }
}

getters.getAddressDistrictCode = (data) => {
  return _toString(data[conf.cell.address_district_code])
}

getters.getAddressDistrictName = (data) => {
  return _toString(data[conf.cell.address_district_name])
}

getters.getAddressSubdistrictCode = (data) => {
  return _toString(data[conf.cell.address_subdistrict_code])
}

getters.getAddressSubdistrictName = (data) => {
  return _toString(data[conf.cell.address_subdistrict_name])
}

getters.getAddressVillageCode = (data) => {
  return _toString(data[conf.cell.address_village_code])
}

getters.getAddressVillageName = (data) => {
  return _toString(data[conf.cell.address_village_name])
}

getters.getAddressStreet = (data) => {
  return _toString(data[conf.cell.address_street])
}

getters.getNationality = (data) => {
  return _toString(data[conf.cell.nationality])
}

getters.getNationalityName = (data) => {
  return _toString(data[conf.cell.nationality_name]) || ""
}

getters.getToolTester = (data) => {
  return _toString(data[conf.cell.tool_tester])
}

getters.getTestMethod = (data) => {
  return _toString(data[conf.cell.test_method]) || ""
}

getters.getTestLocationType = (data) => {
  return _toString(data[conf.cell.test_location_type])
}

getters.getTestLocation = (data) => {
  return _toString(data[conf.cell.test_location])
}

getters.getFinalResult = (data) => {
  return _toString(data[conf.cell.final_result])
}

getters.getSwabTo = (data) => {
  return _toString(data[conf.cell.swab_to])
}

getters.getTestDate = (data) => {
  return _toDateString(data[conf.cell.test_date])
}

getters.getTestNote = (data) => {
  return _toString(data[conf.cell.test_note]) || ""
}

getters.getNoteNik = (data) => {
  return _toString(data[conf.cell.note_nik]) || ""
}

getters.getNotePhoneNumber = (data) => {
  return _toString(data[conf.cell.note_phone_number]) || ""
}

module.exports = getters