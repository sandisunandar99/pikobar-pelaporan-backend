const mongoose = require('mongoose')

const HospitalSchema = new mongoose.Schema({
    name: String,
    description: String,
    address: String,
    phone_numbers: Array,
    kabkota_id: Number,
    kec_id: Number,
    kel_id: Number,
    kemendagri_kabupaten_kode: String,
    kemendagri_kecamatan_kode: String,
    kemendagri_kelurahan_kode: String,
    latitude: String,
    longitude: String
})


HospitalSchema.methods.toJSONFor = function () {  
    return {
        _id : this._id,
        name : this.name,
        description: this.description,
        address: this.address,
        phone_numbers: this.phone_numbers,
        kabkota_id: this.kabkota_id,
        kec_id: this.kec_id,
        kel_id: this.kel_id,
        kemendagri_kabupaten_kode: this.kemendagri_kabupaten_kode,
        kemendagri_kecamatan_kode: this.kemendagri_kecamatan_kode,
        kemendagri_kelurahan_kode: this.kemendagri_kelurahan_kode,
        latitude: this.latitude,
        longitude: this.longitude
    }
}


module.exports = mongoose.model('Hospital', HospitalSchema)
