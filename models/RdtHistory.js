const mongoose = require('mongoose')

const RdtHistorySchema = new mongoose.Schema({
    rdt : { type: mongoose.Schema.Types.ObjectId, ref: 'Rdt' },
  
    final_result : {type : String},
    tool_tester: String,
    code_tool_tester: String, // code alat pas tes ex: (RDT / TCR)
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

}, { timestamps : true });

RdtHistorySchema.methods.toJSONFor = function () {
    return {
        date : this.date,
        location_address : this.location_address,
        location_district_code : this.location_district_code,
        location_subdistrict_code : this.location_subdistrict_code,
        result : this.result,
        instrument : this.instrument,
        method : this.method,
        note : this.note,
    }
}

module.exports = mongoose.model('RdtHistory', RdtHistorySchema)
