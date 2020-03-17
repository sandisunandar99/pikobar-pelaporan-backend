const mongoose = require('mongoose')

const CaseSchema = new mongoose.Schema({
    // (NIK/Nomor Kasus) ex : covid_kodeprovinsi_kodekota/kab_nokasus
    id : {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], index: true},
    // NIK sumber terkait kontak erat
    id_info : String,
    name: String,
    // tentatif jika diisi usia, required jika tidak
    birth_date : { type: Date, required: [true, "can't be blank"]},
    age : Number,
    gender : Number, // 0 : unknown, 1 : male, 2 : female
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
    cache_status : Number,
    cache_stage : Number,
    cache_result : Number,
    cache_last_change : String,
    id_author : String,
})

CaseSchema.methods.toJSONFor = function () {
    return {
        id: this.id,
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
