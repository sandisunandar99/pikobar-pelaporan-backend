const mongoose = require('mongoose')

const RdtHistorySchema = new mongoose.Schema({
    rdt : { type: mongoose.Schema.Types.ObjectId, ref: 'Rdt' },
  
    final_result : {type : String},
    tool_tester: String,
    code_tool_tester: String, // code alat pas tes ex: (RDT / TCR)
    test_method: String,
    sampling_type: String, // Jenis pengambilan sampel: Vena / Kapiler
    
    test_sample: String,
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
        final_result : this.final_result,
        tool_tester: this.tool_tester,
        code_tool_tester: this.code_tool_tester, 
        test_method: this.test_method,
        sampling_type: this.sampling_type, 
        
        test_location_type: this.test_location_type,
        test_location: this.test_location,
        test_other_location: this.test_other_location,
        test_address_district_code : this.test_address_district_code,
        test_address_district_name : this.test_address_district_name,
        test_address_subdistrict_code : this.test_address_subdistrict_code,
        test_address_subdistrict_name : this.test_address_subdistrict_name,
        test_address_village_code : this.test_address_village_code,
        test_address_village_name : this.test_address_village_name,
        test_address_detail: this.test_address_detail,

        test_note : this.test_note,
        test_date: this.test_date,
    }
}

module.exports = mongoose.model('RdtHistory', RdtHistorySchema)
