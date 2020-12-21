const districtcities = {
  $lookup: {
    from: "districtcities",
    localField: "address_district_code",
    foreignField: "kemendagri_kabupaten_kode",
    as: "kota"
  }
}

module.exports = {
  districtcities
}