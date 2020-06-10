const mongoose = require('mongoose')

const UnitSchema = new mongoose.Schema({
    unit_level: Number,
    unit_code: String, //null sementara
    unit_type: String, //puskesmas, rs, klinik
    name: String,
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    delete_status: String,
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Unit', UnitSchema);