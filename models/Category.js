const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    category_name: {type: String,required: [true, "can't be blank"]},
    targets: {type: String,required: [true, "can't be blank"]}
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