const mongoose = require('mongoose')

const CaseApprovalSchema = new mongoose.Schema({
    case : { type: mongoose.Schema.Types.ObjectId, ref: 'Case'},
    note: String,
    verified_status : { type: String, uppercase: true, required: [true, "can't be blank"]},
    verifier : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps : true });

CaseApprovalSchema.methods.toJSONFor = function () {
    return {
        case: this.case,
        note : this.note,
        verified_status : this.verified_status,
        verifier: this.verifier.JSONCase()
    }
}

module.exports = mongoose.model('CaseApproval', CaseApprovalSchema)
