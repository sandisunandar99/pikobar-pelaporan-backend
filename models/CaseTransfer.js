const mongoose = require('mongoose')

const CaseTransferSchema = new mongoose.Schema({
    transfer_comment: String,
    transfer_status : { type: String, lowercase: true, required: [true, "can't be blank"]},
    transfer_case_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Case'},
    transfer_from_unit_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: [true, "can't be blank"]},
    transfer_to_unit_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: [true, "can't be blank"]},
    createdBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps : true });

CaseTransferSchema.index( { transfer_from_unit_id: 1 } )
CaseTransferSchema.index( { transfer_to_unit_id: 1 } )
CaseTransferSchema.index( { transfer_status: 1 } )

CaseTransferSchema.methods.toJSONFor = function () {
    return {
        transfer_comment: this.transfer_comment,
        transfer_status : this.transfer_status,
        transfer_case_id: this.transfer_case_id,
        transfer_from_unit_id: this.transfer_from_unit_id,
        transfer_to_unit_id: this.transfer_to_unit_id,
        createdBy: this.createdBy ? this.createdBy.JSONCase() : null,
        createdAt : this.createdAt
    }
}

module.exports = mongoose.model('CaseTransfer', CaseTransferSchema)
