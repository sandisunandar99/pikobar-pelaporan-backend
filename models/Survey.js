const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const uniqueValidator = require('mongoose-unique-validator')
const urlCrypt = require('url-crypt')(process.env.URL_TOKEN_RESPONDENT)


require('./User')
const User = require('./User')

require('./Question')
const Question = require('./Question')


const SurveySchema = new mongoose.Schema({
    survey_name: { type: String, required: [true, "can't be blank"]},
    category: String,
    using_for: String,
    description: String,
    introduction: String,
    periode_start: { type: Date, required: [true, "can't be blank"]},
    periode_end: { type: Date, required: [true, "can't be blank"] },
    respondent_target: { type: Number, default: 0 },
    respondent_input: {type: Number, default: 0},
    status: String,
    author:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    question: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question'}],
    deletedAt: {type: Date}
},{timestamps: true, usePushEach: true})

SurveySchema.plugin(uniqueValidator, {message: 'sudah pernah dibuat.'})
SurveySchema.plugin(mongoosePaginate)


SurveySchema.pre('validate', function (next){
    this.getid()
    next()
})


SurveySchema.methods.getid = function () {
    this._id = this._id
}

SurveySchema.methods.counts = function () {
    var lenght = Array.from(this.question).length
    return lenght
}


SurveySchema.methods.getUrl = function () {
    let base64 = urlCrypt.cryptObj({
        id: this._id
    });

    return base64
}


SurveySchema.methods.toJSONFor = function(user){
    return{
        id: this._id,
        author: this.author.authorSurvey(user),
        survey_name: this.survey_name,
        category: this.category,
        using_for: this.using_for,
        description: this.description,
        introduction: this.introduction,
        periode_start: this.periode_start,
        periode_end: this.periode_end,
        respondent_target: this.respondent_target, 
        respondent_input: this.respondent_input,
        status: this.status,
        count_question: this.counts(),
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        url: this.getUrl(),
    }
}

SurveySchema.methods.JSONForSurveyQuestion = function (user, survey) {  
    return {
        id: this._id,
        author: this.author.authorSurvey(user),
        survey_name: this.survey_name,
        category: this.category,
        using_for: this.using_for,
        description: this.description,
        introduction: this.introduction,
        periode_start: this.periode_start,
        periode_end: this.periode_end,
        count_question: this.counts(),
        url: this.getUrl()
    }
}


SurveySchema.methods.JSONForSurveyAnswer = function (user, survey) {
    return {
        id: this._id,
        survey_name: this.survey_name,
        category: this.category,
        using_for: this.using_for,
        description: this.description,
        introduction: this.introduction,
        periode_start: this.periode_start,
        periode_end: this.periode_end,
        respondent_target: this.respondent_target,
        respondent_input: this.respondent_input
    }
}


SurveySchema.methods.JSONForSurveyQuestionPublic = function () {
    return {
        id: this._id,
        survey_name: this.survey_name,
        category: this.category,
        using_for: this.using_for,
        description: this.description,
        introduction: this.introduction,
        periode_start: this.periode_start,
        periode_end: this.periode_end,
        count_question: this.counts(),
        url: this.getUrl()
    }
}


SurveySchema.methods.JSONforAnswer = function() {
    return {
        id: this._id,
        survey_name: this.survey_name,
        category: this.category,
        using_for: this.using_for
    }
}


module.exports = mongoose.model('Survey', SurveySchema)