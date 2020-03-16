const mongoose = require('mongoose')

const CaseSchema = new mongoose.Schema({
    id: String,
    name: String,
    birth_date: String,
    age: Number,
    gender: Number,
    phone_number: String,
    address_street: String,
    address_province_code: Number,
    address_city_code: Number
})

CaseSchema.methods.toJSONFor = function () {
    return {
        id: this.id,
        name: this.name,
        birth_date: this.birth_date,
        age: this.age,
        gender: this.gender,
        phone_number: this.phone_number,
        address_street: this.address_street,
        address_province_code: this.address_province_code,
        address_city_code: this.address_city_code
    }
}

module.exports = mongoose.model('Case', CaseSchema)
