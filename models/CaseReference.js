const mongoose = require('mongoose')

const CaseReferenceSchema = new mongoose.Schema({
    case : { type: mongoose.Schema.Types.ObjectId, ref: 'Case'},
    reference_comment: String,
    reference_hospital : { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital'},
    reference_status : { type: String, lowercase: true, required: [true, "can't be blank"]},
    referrer : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps : true });

CaseReferenceSchema.index( { reference_hospital: 1 } )
CaseReferenceSchema.index( { reference_status: 1 } )

CaseReferenceSchema.methods.toJSONFor = function () {
    return {
        case: this.case,
        referrer_comment: this.referrer_comment,
        reference_hospital: this.reference_hospital,
        reference_status : this.reference_status,
        referrer: this.referrer ? this.referrer.JSONCase() : null,
        createdAt : this.createdAt
    }
}

module.exports = mongoose.model('CaseReference', CaseReferenceSchema)
