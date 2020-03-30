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

    birth_date : {type : String},
    age : {type : String},

    nationality: {type:String},
    nationality_name: {type: String},

    final_result : {type : String},
    tool_tester: String,
    code_tool_tester: String, // code alat pas tes ex: (RDT / TCR)
    
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

    test_method: String,
    
    status : {type : String}
},{ timestamps:true, usePushEach: true })

RdtSchema.plugin(mongoosePaginate)
RdtSchema.plugin(uniqueValidator, { message: 'ID already exists in the database.' })


module.exports = mongoose.model('Rdt', RdtSchema)
