const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
var uniqueValidator = require('mongoose-unique-validator')

const CaseSchema = new mongoose.Schema({
    // (NIK/Nomor Kasus) ex : covid_kodeprovinsi_kodekota/kab_nokasus
    id_case : {type: String, lowercase: true, unique: true, index: true},
    // NIK sumber terkait kontak erat
    id_case_national : {type:String},
    nik : {type:String},
    id_case_related : {type:String},
    name: {type:String},
    // tentatif jika diisi usia, required jika tidak
    birth_date : { type: Date},
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
    office_address: {type:String},
    phone_number: {type:String},
    nationality: {type:String},
    nationality_name: {type: String},
    occupation: {type:String},
    last_history : {type: mongoose.Schema.Types.ObjectId, ref: 'History'},
    author : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    stage: String,
    status: String,
    final_result: String,
    delete_status: String,
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verified_status: String,
    verified_comment: {type: String, default: null},
    is_test_masif: {type: Boolean, default: false}

},{ timestamps:true, usePushEach: true })

CaseSchema.plugin(mongoosePaginate)
CaseSchema.plugin(uniqueValidator, { message: 'ID already exists in the database.' })


CaseSchema.methods.toJSONFor = function () {
    return {
        _id: this._id,
        id_case: this.id_case,
        name: this.name,
        age: this.age,
        nik: this.nik,
        nationality: this.nationality,
        nationality_name: this.nationality_name,
        gender: this.gender,
        current_location_address: this.last_history.current_location_address,
        address_district_name: this.address_district_name,
        address_district_code: this.address_district_code,
        phone_number: this.phone_number,
        stage: this.stage,
        status: this.status,
        verified_status: this.verified_status,
        verified_comment: this.verified_comment,
        final_result: this.final_result,
        delete_status: this.delete_status,
        deletedAt: this.deletedAt,
        author: this.author.JSONCase(),
        last_history: this.last_history,
        is_test_masif: this.is_test_masif
    }
}


CaseSchema.methods.JSONFormCase = function () {
    let covid = this.id_case
    let nik = this.nik === null || this.nik === undefined ? "-" : this.nik
    return {
        display: this.name + '/'+nik+'/'+this.phone_number,
        id_case: this.id_case,
        id: this._id
    }
}


CaseSchema.methods.JSONSeacrhOutput = function () {
    return {
       id: this._id,
       id_case: this.id_case,
       target: null,
       nik: this.nik,
       name: this.name,
       birth_date: this.birth_date,
       age: this.age,
       gender: this.gender,
       address_detail: this.address_street,
       address_district_code: this.address_district_code,
       address_district_name: this.address_district_name,
       address_subdistrict_code: this.address_subdistrict_code,
       address_subdistrict_name: this.address_subdistrict_name,
       address_village_code: this.address_village_code,
       address_village_name: this.address_village_name,
       phone_number: this.phone_number,
       category: null,
       mechanism: null,
       nationality: this.nationality,
       nationality_name: this.nationality_name,
       final_result: this.final_result,
       test_location_type: null,
       test_location: null,
       status: null
    }
}

CaseSchema.methods.JSONExcellOutput = function () {
    return {
       "ID Kasus": this.id_case,
       "NIK": this.nik,
       "Nama": this.name,
       "Tanggal Lahir": this.birth_date,
       "Usia": this.age,
       "Jenis Kelamin": this.gender,
       "Alamat Tempat Tinggal": `${this.address_street} ${this.address_district_name} ${this.address_subdistrict_name} ${this.address_subdistrict_name}`,
       "Kewarganegaraan": this.nationality,
       "No. Telp": this.phone_number,
       "Pekerjaan": this.office_address,
       "Status": this.status,
       "Tahapan": this.stage,
       "Hasil": this.final_result,
       "Lokasi saat ini": this.last_history.current_location_address,
       "Tanggal Awal gejala": this.last_history.first_symptom_date,
       "Gejala": this.last_history.diagnosis.toString(),
       "Riwayat": this.last_history.final_result,
       "Tanggal Input": this.createdAt,
       "Author": this.author.fullname
    }
}


module.exports = mongoose.model('Case', CaseSchema)
