const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')


const AnswerSchema = new mongoose.Schema({
    survey: {type: mongoose.Schema.Types.ObjectId, ref:'Survey'},
    respondent: mongoose.Schema.Types.Mixed
}, {timestamps: true, usePushEach: true})

AnswerSchema.plugin(mongoosePaginate)


AnswerSchema.methods.toJSONFor = function() {
    return {
        id: this._id,
        survey: this.survey.JSONforAnswer(),
        respondent: this.respondent
    }
}

AnswerSchema.methods.JSONlistAnswer = function () {  
    return this.respondent
}


module.exports = mongoose.model('Answer', AnswerSchema)