const mongoose = require('mongoose')

const CaseSchema = new mongoose.Schema({
    // (NIK/Nomor Kasus) ex : covid_kodeprovinsi_kodekota/kab_nokasus
    id_case : {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], index: true},
    // NIK sumber terkait kontak erat
    id_case_national : {type:Number},
    id_case_related : {type:String},
    name: {type:String},
    // tentatif jika diisi usia, required jika tidak
    birth_date : { type: Date, required: [true, "can't be blank"]},
    age : {type:Number},
    gender : {type:String},
    address_street: {type:String},
    address_village_code: { type: String, required: [true, "can't be blank"]},
    // kecamatan
    address_subdistrict_code: { type: String, required: [true, "can't be blank"]},
    // kab/kota
    address_district_code: { type: String, required: [true, "can't be blank"]},
    address_province_code: { type: String, default:32},
    phone_number: {type:String},
    nationality: {type:String},
    occupation: {type:String},
    last_status : {type:String},
    last_stage : {type:String},
    last_result : {type:String},
    last_history : {type:String},
    author : {type:String},
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
