const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
var uniqueValidator = require('mongoose-unique-validator')

const RdtSchema = new mongoose.Schema({
    code_rdt : {type : String},
    id_case : {type : String},
    type_target : {type : String},
    nik : {type : String},
    nama : {type : String},
    birth_date : {type : String},
    age : {type : String},
    gender : {type : String},
    phone_number : {type : String},
    address_district_code : {type : String},
    address_district_name : {type : String},
    address_subdistrict_code : {type : String},
    address_subdistrict_name : {type : String},
    address_village_code : {type : String},
    address_village_name : {type : String},
    final_result : {type : String},
    note : {type : String},
    organization_institution : {type : String},
    contact_source_name : {type : String},
    hospital_name : {type : String},
    test_date : {type : String},
    created_by : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_by_name : {type : String},
    updated_by : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updated_by_name : {type : String},
    created_at : {type : String},
    updated_at : {type : String},
    status : {type : String}
},{ timestamps:true, usePushEach: true })

RdtSchema.plugin(mongoosePaginate)
RdtSchema.plugin(uniqueValidator, { message: 'ID already exists in the database.' })


RdtSchema.methods.toJSONFor = function () {
    return {
        _id: this._id,
        code_rdt : this.code_rdt
        id_case : this.id_case
        type_target : this.type_target
        nik : this.nik
        nama : this.nama
        birth_date : this.birth_date
        age : this.age
        gender : this.gender
        phone_number : this.phone_number
        address_district_code : this.address_district_code
        address_district_name : this.address_district_name
        address_subdistrict_code : this.address_subdistrict_code
        address_subdistrict_name : this.address_subdistrict_name
        address_village_code : this.address_village_code
        address_village_name : this.address_village_name
        final_result : this.final_result
        note : this.note
        organization_institution : this.organization_institution
        contact_source_name : this.contact_source_name
        hospital_name : this.hospital_name
        test_date : this.test_date
        created_by : this.created_by
        created_by_name : this.created_by_name
        updated_by : this.updated_by
        updated_by_name : this.updated_by_name
        created_at : this.created_at
        updated_at : this.updated_at
        status : this.status
    }
}

module.exports = mongoose.model('Rdt', RdtSchema)
