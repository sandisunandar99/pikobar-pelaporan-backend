const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    survey: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey'},
    sequence_question: Number,
    form_type: {type: String, required: true},
    question: {type: String, required: true},
    description: String,
    options:  {type: Array, default: []},
    require: {type: Boolean}
}, {timestamps: true, usePushEach: true})


QuestionSchema.methods.SurveyQuestion = function (params) {
    return {
        id: this._id,
        sequence_question: this.sequence_question,
        form_type: this.form_type,
        question: this.question,
        description: this.description,
        options: this.options,
        require: this.require
    }
}


module.exports = mongoose.model('Question', QuestionSchema)