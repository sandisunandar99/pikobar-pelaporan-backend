const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
var uniqueValidator = require('mongoose-unique-validator')

const RdtSchema = new mongoose.Schema({
    code_test : {type : String}, // code peserta (PST) tergantung alat tes yang di pilih
    
    category: String,
    target: String,
    mechanism: String,
    id_case : {type : String},
    nik : {type : String},
    note_nik: {type: String},
    name : {type : String},
    gender : {type : String},
    
    address_district_code : {type : String},
    address_district_name : {type : String},
    address_subdistrict_code : {type : String},
    address_subdistrict_name : {type : String},
    address_village_code : {type : String},
    address_village_name : {type : String},
    address_detail: String,
    phone_number : {type : String},
    note_phone_number: {type: String},

    birth_date : {type : String},
    age : {type : String},

    nationality: {type:String},
    nationality_name: {type: String},

    final_result : {type : String},
    tool_tester: String,
    code_tool_tester: String, // code alat pas tes ex: (RDT / TCR)
    sampling_type: String, // Jenis pengambilan sampel: Vena / Kapiler
    test_method: String,
    
    test_location_type: String,
    test_location: String,
    test_other_location: String,
    test_address_district_code : {type : String},
    test_address_district_name : {type : String},
    test_address_subdistrict_code : {type : String},
    test_address_subdistrict_name : {type : String},
    test_address_village_code : {type : String},
    test_address_village_name : {type : String},
    test_address_detail: String,
    test_note : {type : String},
    test_date: Date,

    rdt_count: {type: Number, default: 0},
    pcr_count: {type: Number, default: 0}, 
    swab_to: {type: Number, default: 0}, 
    rdt_to: {type: Number, default: 0}, 
    lab: String,

    author : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    author_district_code : { type:String},
    author_district_name : { type: String},
    
    source_data: {type: String},

    last_history: { type: mongoose.Schema.Types.ObjectId, ref: 'RdtHistory' },
    status : {type : String},
    deletedAt: Date,
    deletedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    
},{ timestamps:true, usePushEach: true })

RdtSchema.plugin(mongoosePaginate)
RdtSchema.plugin(uniqueValidator, { message: 'ID already exists in the database.' })


RdtSchema.methods.toJSONFor = function () {
    return {
        _id : this._id,
        code_test : this.code_test, // code peserta (PST) tergantung alat tes yang di pilih
        
        category: this.category,
        target: this.target,
        mechanism: this.mechanism,
        id_case : this.id_case,
        nik : this.nik,
        note_nik: this.note_nik,
        name : this.name,
        gender : this.gender,
        
        address_district_code : this.address_district_code,
        address_district_name : this.address_district_name,
        address_subdistrict_code : this.address_subdistrict_code,
        address_subdistrict_name : this.address_subdistrict_name,
        address_village_code : this.address_village_code,
        address_village_name : this.address_village_name ,
        address_detail: this.address_detail ,
        phone_number : this.phone_number ,
        note_phone_number: this.note_phone_number,

        birth_date : this.birth_date,
        age : this.age,

        nationality: this.nationality ,
        nationality_name: this.nationality_name ,

        final_result: this.final_result ,
        tool_tester: this.tool_tester,
        code_tool_tester: this.code_tool_tester , // code alat pas tes ex (RDT / TCR)
        test_method: this.test_method,
        sampling_type: this.sampling_type, 
        
        test_location :this.test_location ,
        test_other_location :this.test_other_location ,
        test_address_district_code :this.test_address_district_code ,
        test_address_district_name :this.test_address_district_name ,
        test_address_subdistrict_code :this.test_address_subdistrict_code ,
        test_address_subdistrict_name :this.test_address_subdistrict_name ,
        test_address_village_code :this.test_address_village_code ,
        test_address_village_name :this.test_address_village_name ,
        test_address_detail :this.test_address_detail ,
        test_note :this.test_note ,
        test_date :this.test_date ,
        
        rdt_count : this.rdt_count,
        pcr_count : this.pcr_count,
        swab_to : this.swab_to,
        rdt_to : this.rdt_to,
        lab : this.lab,

        status :this.status ,
        author: this.author.JSONCase(),
        last_history: this.last_history
    }
}


module.exports = mongoose.model('Rdt', RdtSchema)
