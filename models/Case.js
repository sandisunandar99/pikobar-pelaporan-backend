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
    address_village_name: { type: String, required: [true, "can't be blank"]},
    // kecamatan
    address_subdistrict_code: { type: String, required: [true, "can't be blank"]},
    address_subdistrict_name: { type: String, required: [true, "can't be blank"]},
    // kab/kota
    address_district_code: { type: String, required: [true, "can't be blank"]},
    address_district_name: { type: String, required: [true, "can't be blank"]},
    address_province_code: { type: String, default:32},
    address_province_name: { type: String, required: [true, "can't be blank"]},
    current_location_address: { type: String, required: [true, "can't be blank"]},
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
        _id: this._id,
        id_case: this.id_case,
        name: this.name,
        age: this.age,
        nationality: this.nationality,
        gender: this.gender,
        current_location_address: this.current_location_address,
        address_district_name: this.address_district_name,
        last_status: this.last_status
    }
}

module.exports = mongoose.model('Case', CaseSchema)
