const mongoose = require('mongoose')

const UnitSchema = new mongoose.Schema({
    unit_level: Number,
    unit_code: String, //null sementara
    unit_type: String, //puskesmas, rs, klinik
    description: String,
    name: String,
    address: String,
    phone_numbers: Array,
    description: String,
    kemendagri_kabupaten_kode: String,
    kemendagri_kecamatan_kode: String,
    kemendagri_kelurahan_kode: String,
    delete_status: String,
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

UnitSchema.methods.toJSONFor = function () {  
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
        longitude: this.longitude,
        rs_jabar: this.rs_jabar
    }
}


module.exports = mongoose.model('Unit', UnitSchema)