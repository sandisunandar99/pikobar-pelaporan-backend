const mongoose = require('mongoose')

const HistorySchema = new mongoose.Schema({
    case : { type: mongoose.Schema.Types.ObjectId, ref: 'Case'}, 
    status : { type: String, uppercase: true, required: [true, "can't be blank"]}, //  ODP / PDP / POSITIF
    stage : { type: String, uppercase: true, required: [true, "can't be blank"]}, // PROSES / SELESAI
    final_result : { type: String, uppercase: true, default: null}, // NEGATIF / MENINGGAL / SEMBUH
    diagnosis : Array,
    last_changed : { type: Date, default: Date.now }, // waktu terjadinya perubahan, isi manual
    // riwayat perjalanan/kontak dengan pasien positif
    history_tracing: Array,
    // kalau dr luar negri
    return_date : Date, 
    visited_country : String,
    history_notes: String,
    other_notes: String,
    // current_location mandatory ketika pilih PDP atau Positif, option ketika ODP -> lokasi saat ini
    current_location_type: String,  // RS / RUMAH
    // nama rumah sakit kalau di rumah sakit, nama kecamatan kalau di tempat tinggal
    current_location_address: String, // or Number?
    current_location_village_code : String,
    current_location_subdistrict_code : String, //kecamatan
    current_location_district_code : String, //kab/kota
    current_location_province_code : {type: String, default: "32"},
}, { timestamps : true });

HistorySchema.methods.toJSONFor = function () {
    return {
        case: this.case,
        status : this.status,
        symptoms : this.symptoms,
        stage : this.stage,
        result : this.result,
        last_changed : this.last_changed,
        history_tracing: this.history_tracing,
        return_date : this.return_date,
        visited_country : this.visited_country,
        history_note: this.history_note,
        other_notes: this.other_notes,
        current_location_type: this.current_location_type,
        current_location_address : this.current_location_address,
        current_location_district_code : this.current_location_district_code,
        current_location_subdistrict_code : this.current_location_subdistrict_code,
        current_location_village_code : this.current_location_village_code,
        current_location_province_code : this.current_location_province_code,
        createdAt : this.createdAt,
        updatedAt : this.updatedAt
    }
}

module.exports = mongoose.model('History', HistorySchema)
