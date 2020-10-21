const validateDistrictPattern = (districtCode, subDistrictCode, villageCode) => {
  const err = {}
  const isAllFilled = districtCode && subDistrictCode && villageCode
  const includeStr = districtCode.substr && subDistrictCode.substr && villageCode.substr

  const districtPatternValid = (nestedCode, code, offset, key, messg) => {
    if (nestedCode.substr(0, offset) != code) {
      if (!Array.isArray(err[label[key]])) {
        err[label[key]] = []
      }
      err[label[key]].push(`\"${prop}"\ ${messg}.`)
    }
  }

  if (isAllFilled && includeStr) {
    districtPatternValid(
      subDistrictCode,
      districtCode,
      5,
      'current_location_subdistrict_code',
      'tidak terdaftar sesuai pada kabupaten yang dipilih'
    )

    districtPatternValid(
      villageCode,
      subDistrictCode,
      5,
      'current_location_village_code',
      'tidak terdaftar sesuai pada kecamatan yang dipilih'
    )
  }

  return err
}

module.exports = {
  validateDistrictPattern,
}
