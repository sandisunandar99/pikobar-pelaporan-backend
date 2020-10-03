const helpers = require("../custom")
const { GENDER } = require("../constant")

const excellHistories = (this_) => {
  let finals = helpers.patientStatus(this_.final_result)
  let criteria = helpers.criteriaConvert(this_)
  let birthDate = this_.birth_date ? helpers.convertDate(this_.birth_date) : null
  let createdDate = this_.createdAt ? helpers.convertDate(this_.createdAt) : null
  let symptomsDate = this_.first_symptom_date ? helpers.convertDate(this_.first_symptom_date) : null
  let lastDate = this_.last_date_status_patient ? helpers.convertDate(this_.last_date_status_patient) : null
  let patientLocation = helpers.locationPatient(this_.current_location_type, this_.current_location_address)

  return {
    "Nama Pasien": this_.name,
    "NIK": this_.nik,
    "Alasan tidak ada NIK": helpers.checkExistColumn(this_.note_nik),
    "No Telepon": helpers.checkExistColumn(this_.phone_number),
    "Alasan Tidak Ada No Telepon": helpers.checkExistColumn(this_.note_phone_number),
    "Tempat Lahir": this_.place_of_birth,
    "Tanggal Lahir": birthDate,
    "Usia Tahun": Math.floor(this_.age),
    "Usia Bulan": Math.ceil((this_.age - Math.floor(this_.age)) * 12),
    "Jenis Kelamin": this_.gender === "L" ? GENDER.ID_L : GENDER.ID_P,
    "Kota/Kab": this_.address_district_name,
    "Kecamatan": this_.address_subdistrict_name,
    "Kel/Desa": this_.address_village_name,
    "Alamat Lengkap (RT/RW)": `${this_.address_street} (${this_.rt}/${this_.rw})`,
    "Pekerjaan": this_.occupation,
    "Alamat Kantor": this_.office_address,
    "Kewarganegaraan": this_.nationality === "WNI" ? "Indonesia" : this_.nationality_name,
    "Kriteria": criteria,
    "Status Pasien Terakhir": finals,
    "Tgl Update Status Pasien Terakhir": lastDate,
    "Dirawat di Rumah Sakit ?": patientLocation.bool,
    "Nama Rumah Sakit": patientLocation.location_name,
    "Tanggal Gejala": symptomsDate,
    ...helpers.checkDiagnosis(this_.diagnosis),
    "Gejala Lainnya": helpers.checkExistColumn(this_.diagnosis_other),
    ...helpers.checkDiseases(this_.diseases),
    "Kondisi Penyerta Lainnya": this_.diseases_other,
    "Diagnosis ARDS": helpers.convertYesOrNO(this_.diagnosis_ards),
    "Diagnosis Pneumonia": helpers.convertYesOrNO(this_.diagnosis_pneumonia),
    "Diagnosis Lainnya": this_.other_diagnosis,
    "Etiologi": helpers.yesOrNoBool(this_.is_other_diagnosisr_respiratory_disease),
    "Sebutkan Etiologi Lainnya": this_.other_diagnosisr_respiratory_disease,
    "Merokok": helpers.convertYesOrNO(this_.smoking),
    "Konsumsi Alkohol": helpers.convertYesOrNO(this_.consume_alcohol),
    "Author": this_.author,
    "Tanggal Input": createdDate,
  }
}

const condition = (params, search, query) => {
  let searching = Object.keys(search).length == 0 ? [search] : search
  let createdAt = {}
  if (query.start_date && query.end_date) {
    let searchRegExp = new RegExp('/', 'g')
    let min = query.start_date
    let max = query.end_date
    let minDate = min.replace(searchRegExp, '-')
    let maxDate = max.replace(searchRegExp, '-')
    createdAt = {
      "createdAt": {
        "$gte": new Date(new Date(minDate).setHours(00, 00, 00)),
        "$lt": new Date(new Date(maxDate).setHours(23, 59, 59))
      }
    }
  }
  let andParam = { ...createdAt, ...params }
  return [
    {
      $match: {
        $and: [andParam],
        $or: searching
      }
    },
    {
      $lookup: {
        from: "histories",
        localField: "_id",
        foreignField: "case",
        as: "histories"
      },
    },
    { $sort: { "id_case": 1} },
    {
      $project: {
        histories: {
          "_id": 1,
          "id": "$id_case",
          "name": "$name",
          "nik": "$nik",
          "note_nik": "$note_nik",
          "phone_number": "$phone_number",
          "note_phone_number": "$note_phone_number",
          "place_of_birth": "$place_of_birth",
          "birth_date": "$birth_date",
          "age": "$age",
          "month": "$month",
          "gender": "$gender",
          "address_district_name": "$address_district_name",
          "address_subdistrict_name": "$address_subdistrict_name",
          "address_village_name": "$address_village_name",
          "address_street": "$address_street",
          "rt": "$rt",
          "rw": "$rw",
          "occupation": "$occupation",
          "office_address": "$office_address",
          "nationality": "$nationality",
          "nationality_name": "$nationality_name",
          "status": "$status",
          "final_result": "$final_result",
          "there_are_symptoms": "$there_are_symptoms",
          "last_date_status_patient": "$last_date_status_patient",
          "current_location_type": "$current_location_type",
          "current_location_address": "$histories.current_location_address",
          "first_symptom_date": "$histories.first_symptom_date",
          "diagnosis": "$histories.diagnosis",
          "diagnosis_other": "$histories.diagnosis_other",
          "diseases": "$histories.diseases",
          "diseases_other": "$histories.diseases_other",
          "diagnosis_ards": "$histories.diagnosis_ards",
          "diagnosis_pneumonia": "$histories.diagnosis_pneumonia",
          "other_diagnosis": "$histories.other_diagnosis",
          "is_other_diagnosisr_respiratory_disease": "$histories.is_other_diagnosisr_respiratory_disease",
          "other_diagnosisr_respiratory_disease": "$histories.other_diagnosisr_respiratory_disease",
          "is_went_abroad": "$is_went_abroad",
          "diagnosis_pneumonia": "$histories.diagnosis_pneumonia",
          "smoking": "$smoking",
          "consume_alcohol": "$consume_alcohol",
          "createdAt": "$createdAt",
          "author": "$author_list.fullname",
        }
      }
    },
    {
      $unwind: "$histories"
    },
    { $replaceRoot: { newRoot: "$histories" } }
  ]
}

module.exports = {
  excellHistories, condition
}