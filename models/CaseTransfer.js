const mongoose = require('mongoose')

const CaseTransferSchema = new mongoose.Schema({
    transfer_comment: String,
    transfer_status : { type: String, lowercase: true, required: [true, "can't be blank"]},
    case_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Case'},
    transfer_hospital_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital'},
    createdBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps : true });

CaseTransferSchema.index( { transfer_hospital_id: 1 } )
CaseTransferSchema.index( { transfer_status: 1 } )

CaseTransferSchema.methods.toJSONFor = function () {
    return {
        transfer_comment: this.transfer_comment,
        transfer_status : this.transfer_status,
        case_id: this.case_id,
        transfer_hospital_id: this.transfer_hospital_id,
        createdBy: this.createdBy ? this.createdBy.JSONCase() : null,
        createdAt : this.createdAt
    }
}

module.exports = mongoose.model('CaseTransfer', CaseTransferSchema)
