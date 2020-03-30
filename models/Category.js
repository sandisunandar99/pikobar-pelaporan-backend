const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    id: String,
    category_name: String,
    targets: String
})


CategorySchema.methods.toJSONForCategory = function () { 
    return {
        id : this._id,
        category_name : this.category_name
    }
}

CategorySchema.methods.toJSONForTarget = function () { 
    return {
        targets : this.targets
    }
}


module.exports = mongoose.model('Category', CategorySchema)