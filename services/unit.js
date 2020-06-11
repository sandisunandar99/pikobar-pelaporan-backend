const mongoose = require('mongoose');

require('../models/Unit');
const Unit = mongoose.model('Unit');

const listUnit = async (callback) => {
    try {
        const result = await Unit.find().populate('createdBy');
        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

const listUnitById = async (id, callback) => {
    try {
        const result = await Unit.findById(id).populate('createdBy');
        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

const createUnit = async (payload, user, callback) => {
    try {
        payload.createdBy = user._id;
        const result = await Unit.create(payload);
        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

const updateUnit = async (pay, id, category, author, callback) => {
    try {
        const payloads = {};
        const payload = (pay == null ? {} : pay);
        if (category == "delete") {
            const date = new Date();
            payloads.delete_status = "deleted";
            payloads.deletedAt = date.toISOString();
            payloads.deletedBy = author;
        }
        const params = Object.assign(payload, payloads);
        const result = await Unit.findByIdAndUpdate(id,
            { $set: params }, { new: true });
        console.log(id);

        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

module.exports = [
    {
        name: 'services.unit.create',
        method: createUnit
    },
    {
        name: 'services.unit.read',
        method: listUnit
    },
    {
        name: 'services.unit.update',
        method: updateUnit
    },
    {
        name: 'services.unit.readbyid',
        method: listUnitById
    },
];

