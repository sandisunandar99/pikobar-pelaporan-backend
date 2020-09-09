const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const HistorySchema = new mongoose.Schema({
    case : { type: mongoose.Schema.Types.ObjectId, ref: 'Case'},
    status : { type: String, uppercase: true, required: [true, "can't be blank"]}, //  ODP / PDP / POSITIF
    stage : { type: String, uppercase: true , default: null}, // PROSES / SELESAI
    final_result : { type: String, uppercase: true, required: [true, "can't be blank"], default: null}, // NEGATIF / MENINGGAL / SEMBUH
    diagnosis : Array,
    diagnosis_other : String,
    diseases : Array, // Kondisi/Penyakit penyerta
    diseases_other : String,
    last_changed : { type: Date, default: Date.now }, // waktu terjadinya perubahan, isi manual
    // riwayat perjalanan/kontak dengan pasien positif
    is_went_abroad : Boolean,
    visited_country : String,
    return_date : Date,
    is_went_other_city : Boolean,
    visited_city : String,
    is_contact_with_positive : Boolean,
    history_notes: String,
    is_sample_taken : Boolean,
    report_source : { type: String, default: null },
    first_symptom_date : {type : Date, default: Date.now()},
    other_notes: String,
    // current_location mandatory ketika pilih PDP atau Positif, option ketika ODP -> lokasi saat ini
    current_location_type: { type: String, uppercase: true, required: [true, "can't be blank"]},  //[RS, RUMAH, OTHERS]
    // nama rumah sakit kalau di rumah sakit, nama kecamatan kalau di tempat tinggal
    is_patient_address_same: { type: Boolean, default: false },
    current_hospital_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default:null},
    current_hospital_type: { type: String, default: null },
    current_location_address: String, // or Number?
    current_location_village_code : String,
    current_location_subdistrict_code : String, //kecamatan
    current_location_district_code : String, //kab/kota
    current_location_province_code : {type: String, default: "32"},
    diagnosis_ards : { type: Number, default: null}, // 1 ya 2 tidak 3 tidak tahu
    diagnosis_covid : { type: Number, default: null}, // 1 ya 2 tidak 3 tidak tahu
    diagnosis_pneumonia : { type: Number, default: null}, // 1 ya 2 tidak 3 tidak tahu
    other_diagnosis: String,
    there_are_symptoms :  { type: Boolean, default: false},
    is_other_diagnosisr_respiratory_disease: {type: Boolean, default: false},
    other_diagnosisr_respiratory_disease: String,
}, { timestamps : true });

HistorySchema.index({case: 1});

HistorySchema.methods.toJSONFor = function () {
    return {
        case: this.case,
        status : this.status,
        stage : this.stage,
        final_result : this.final_result,
        diagnosis : this.diagnosis,
        diagnosis_other : this.diagnosis_other,
        diseases : this.diseases,
        diseases_other : this.diseases_other,
        last_changed: this.last_changed,
        is_went_abroad : this.is_went_abroad,
        visited_country : this.visited_country,
        return_date : this.return_date,
        is_went_other_city : this.is_went_other_city,
        visited_city : this.visited_city,
        is_contact_with_positive : this.is_contact_with_positive,
        history_notes: this.history_notes,
        is_sample_taken : this.is_sample_taken,
        report_source : this.report_source,
        first_symptom_date : this.first_symptom_date,
        other_notes: this.other_notes,
        is_patient_address_same: this.is_patient_address_same,
        current_location_type: this.current_location_type,
        current_hospital_id: this.current_hospital_id,
        current_hospital_type: this.current_hospital_type,
        current_location_address : this.current_location_address,
        current_location_district_code : this.current_location_district_code,
        current_location_subdistrict_code : this.current_location_subdistrict_code,
        current_location_village_code : this.current_location_village_code,
        current_location_province_code : this.current_location_province_code,
        diagnosis_ards : this.diagnosis_ards,
        diagnosis_covid : this.diagnosis_covid,
        diagnosis_pneumonia : this.diagnosis_pneumonia,
        other_diagnosis: this.other_diagnosis,
        physical_check_temperature : this.physical_check_temperature,
        physical_check_blood_pressure : this.physical_check_blood_pressure,
        physical_check_pulse : this.physical_check_pulse,
        physical_check_respiration : this.physical_check_respiration,
        physical_check_height : this.physical_check_height,
        physical_check_weight : this.physical_check_height,
        inspection_support: [{
            inspection_type: this.inspection_type,
            specimens_type: this.specimens_type,
            inspection_date: this.inspection_date ,
            inspection_location: this.inspection_location,
            get_specimens_to: this.get_specimens_to,
            inspection_result: this.inspection_result
        }],
        is_other_diagnosisr_respiratory_disease: this.is_other_diagnosisr_respiratory_disease,
        other_diagnosisr_respiratory_disease: this.other_diagnosisr_respiratory_disease,
        // mengunjungi tempat public
        has_visited_public_place: this.has_visited_public_place,
        visited_public_place: [{
            public_place_category: this.public_place_category,
            public_place_name: this.public_place_name,
            public_place_address: this.public_place_address,
            public_place_date_visited: this.public_place_date_visited,
            public_place_duration_visited: this.public_place_duration_visited
        }],
        //faktor riwayat perjalanan
        travelling_history_before_sick_14_days: this.travelling_history_before_sick_14_days ,
        travelling_history: [{
            travelling_type:this.travelling_type,
            travelling_visited:this.travelling_visited,
            travelling_visited: this.travelling_visited,
            travelling_date:this.travelling_date,
            travelling_arrive:this.travelling_arrive
        }],
        visited_local_area_before_sick_14_days: this.visited_local_area_before_sick_14_days,
        visited_local_area: [{
            visited_local_area_province: this.visited_local_area_province,
            visited_local_area_city: this.visited_local_area_city,
        }],
        //faktor kontak paparan
        close_contacted_before_sick_14_days: this.close_contacted_before_sick_14_days,
        close_contact_premier: [{
          close_contact_name: this.close_contact_name,
          close_contact_criteria: this.close_contact_criteria,
          //address
          close_contact_address_street: this.close_contact_address_street,
          is_close_contact_address_same: this.is_close_contact_address_same,
          close_contact_address_village_code:this.close_contact_address_village_code,
          close_contact_address_village_name:this.close_contact_address_village_name,
          close_contact_address_subdistrict_code:this.close_contact_address_subdistrict_code,
          close_contact_address_subdistrict_name:this.close_contact_address_subdistrict_name,
          close_contact_address_district_code:this.close_contact_address_district_code,
          close_contact_address_district_name:this.close_contact_address_district_name,
          close_contact_address_province_code: this.close_contact_address_province_code,
          close_contact_address_province_name: this.close_contact_address_province_name ,
          close_contact_rt: this.close_contact_rt,
          close_contact_rw: this.close_contact_rw,
          close_contact_relation: this.close_contact_relation,
          close_contact_relation_id: this.close_contact_relation_id,
          close_contact_first_date: this.close_contact_first_date,
          close_contact_last_date: this.close_contact_last_date,
        }],
        close_contact_heavy_ispa_group:this.close_contact_heavy_ispa_group,
        close_contact_have_pets:this.close_contact_have_pets,
        close_contact_pets: this.close_contact_pets,
        close_contact_health_worker: this.close_contact_health_worker,
        apd_use: this.apd_use,
        close_contact_performing_aerosol_procedures: this.close_contact_performing_aerosol_procedures,
        close_contact_performing_aerosol: this.close_contact_performing_aerosol,
        createdAt : this.createdAt,
        updatedAt : this.updatedAt
    }
}

HistorySchema.methods.JSONCaseTransfer = function () {
    return {
        status : this.status,
        stage : this.stage,
        final_result : this.final_result
    }
}
HistorySchema.plugin(mongoosePaginate);
HistorySchema.pre('save', async function (next) {

  try {
    const hospitalId = this.current_hospital_id
    if (!hospitalId) return

    const unit = await mongoose.models["Unit"]
      .findById(hospitalId)
      .select('rs_type')

    if (!unit || !unit.rs_type) return

    const source = {
      current_hospital_type: unit.rs_type
    }

    Object.assign(this, source)

  } catch (e) {
    throw new Error(e)
  }

  next()
})

module.exports = mongoose.model('History', HistorySchema)
