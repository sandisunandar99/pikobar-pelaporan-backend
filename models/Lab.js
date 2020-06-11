const mongoose = require('mongoose')

const LabSchema = new mongoose.Schema({
    lab_name: String,
    location: String,
})


LabSchema.methods.toJSONFor = function () {
    return {
        _id: this._id,
        lab_name: this.lab_name,
        location: this.location,
    }
}

module.exports = mongoose.model('Lab', LabSchema)