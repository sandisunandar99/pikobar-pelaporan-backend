'use strict';
const check = require("../historycheck");
const helpers = require("../custom");
const excellOutput = (this_) => {
  let finals, stages, birthDate, createDate, diagnosis, diagnosis_other;

  if (this_.final_result == '0') {
    finals = 'NEGATIF';
  } else if (this_.final_result == '1') {
    finals = 'SEMBUH';
  } else if (this_.final_result == '2') {
    finals = 'MENINGGAL';
  } else {
    finals = null;
  }

  stages = (this_.stage == 0 ? "Prosess" : "Selesai")
  birthDate = (this_.birth_date != null ? helpers.convertDate(this_.birth_date) : null)
  createDate = (this_.createdAt != null ? helpers.convertDate(this_.createdAt) : null)
  diagnosis = (this_.last_history.diagnosis > 1 ? "" : this_.last_history.diagnosis.toString())
  diagnosis_other = (this_.last_history.diseases > 1 ? "" : this_.last_history.diseases.toString())

  return {
    "Kode Kasus": this_.id_case,
    "Kode Kasus Pusat": this_.id_case_national,
    "Tanggal Lapor": createDate,
    "Sumber Lapor": (this_.last_history !== null ? this_.last_history.report_source : null),
    "NIK": this_.nik,
    "Nama": this_.name,
    "Tanggal Lahir": birthDate,
    "Usia": this_.age,
    "Jenis Kelamin": this_.gender,
    "Provinsi": "Jawa Barat",
    "Kota": this_.address_district_name,
    "Kecamatan": this_.address_subdistrict_name,
    "Kelurahan": this_.address_village_name,
    "Alamat detail": `${this_.address_street}`,
    "No Telp": this_.phone_number,
    "Kewarganegaraan": this_.nationality,
    "Negara": (this_.nationality == "WNI" ? "Indonesia" : this_.nationality_name),
    "Pekerjaan": this_.occupation,
    "Gejala": diagnosis,
    "Kondisi Penyerta": diagnosis_other,
    "Riwayat": check.historyCheck(this_.last_history),
    "Status": this_.status,
    "Tahapan": stages,
    "Hasil": finals,
    "Lokasi saat ini": (this_.last_history !== null ? this_.last_history.current_location_address : null),
    "Tanggal Input": createDate,
    "Catatan Tambahan": (this_.last_history !== null ? this_.last_history.other_notes : ''),
    "Author": this_.author.fullname
  }
}

module.exports = {
  excellOutput,
}