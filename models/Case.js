const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
var uniqueValidator = require('mongoose-unique-validator')

const CaseSchema = new mongoose.Schema({
    // (NIK/Nomor Kasus) ex : covid_kodeprovinsi_kodekota/kab_nokasus
    id_case : {type: String, lowercase: true, unique: true, index: true},
    // NIK sumber terkait kontak erat
    id_case_national : {type:String},
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
    address_province_name: { type: String, default:"Jawa Barat"},
    phone_number: {type:String},
    nationality: {type:String},
    occupation: {type:String},
    last_history : {type: mongoose.Schema.Types.ObjectId, ref: 'History'},
    author : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{ timestamps:true, usePushEach: true })

CaseSchema.plugin(mongoosePaginate)
CaseSchema.plugin(uniqueValidator, { message: 'ID ini sudah ada di basis data.' })


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
        last_status: this.last_status,
        last_stage: this.last_stage,
        last_history: this.last_history
    }
}

module.exports = mongoose.model('Case', CaseSchema)
