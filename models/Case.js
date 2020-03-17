const mongoose = require('mongoose')

const CaseSchema = new mongoose.Schema({
    // (NIK/Nomor Kasus) ex : covid_kodeprovinsi_kodekota/kab_nokasus
    id_case : {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], index: true},
    // NIK sumber terkait kontak erat
    id_case_national : Number,
    id_case_related : String,
    name: String,
    // tentatif jika diisi usia, required jika tidak
    birth_date : { type: Date, required: [true, "can't be blank"]},
    age : Number,
    gender : String,
    address_street: String,
    address_village_code: { type: String, required: [true, "can't be blank"]},
    // kecamatan
    address_subdistrict_code: { type: String, required: [true, "can't be blank"]},
    // kab/kota
    address_district_code: { type: String, required: [true, "can't be blank"]},
    address_province_code: { type: String, required: [true, "can't be blank"]},
    phone_number: String,
    nationality: String,
    occupation: String,
    last_status : String,
    last_stage : String,
    last_result : String,
    last_change : String,
    id_author : String,
},{ timestamps:true })

CaseSchema.methods.toJSONFor = function () {
    return {
        id_case: this.id_case,
        name: this.name,
        age: this.age,
        gender: this.gender,
        address_province_code: this.address_province_code,
        address_district_code: this.address_district_code,
        address_subdistrict_code: this.address_subdistrict_code,
        address_village_code: this.address_village_code
    }
}

module.exports = mongoose.model('Case', CaseSchema)
