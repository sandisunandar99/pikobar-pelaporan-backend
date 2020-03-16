const mongoose = require('mongoose')
const Promise = require('bluebird')

require('../models/Question')
const Question = mongoose.model('Question')

require('../models/Survey')
const Survey = mongoose.model('Survey')


async function createQuestion(payload, survey, beforeSave, callback) {
    /**
     * this script for save 1 object not for array
     */
    /*
    let question = await new Question(Object.assign({ survey }, payload))
    question.save().then(saveQuestion => {
        survey.question.push(saveQuestion._id)
        return survey.save().then((_) => {
            // return callback(null, saveQuestion)
        }).catch(err => callback(err, null))
    }).catch(err => callback(err, null))
    */

    if (beforeSave.deleted === true) {
        let resultForResponse = []

        const process = async () => {
            for(const payloads of payload){
                const result = await returnPayload (payloads)
                let question = await new Question(Object.assign({ survey }, result))
                question.save().then(saveQuestion => {
                    survey.question.push(saveQuestion._id)
                    return survey.save().then((_) =>{/** going on after saves*/})
                }).catch(err => callback(err, null))
            }
            // After process listing array
        }

        const returnPayload = x => {
            return new Promise((resolve, reject) =>{
                setTimeout(() =>{
                    resolve(x)
                    resultForResponse.push(x)
                }, 300)
            })  
        }

        process().then(() =>{
            // end process off save array process 
            return callback(null, resultForResponse)
        })
    } else {
        return callback(null, null)
    }
    
    

}


function getSurveyById(id,user,callback) {
    Survey.findById(id)
        .populate('question')
        .populate('author')
        .exec()
        .then(survey => {   
            return callback(null, survey)
        }).catch(err => callback(err, survey));
}


function getQuestionBySurveyId (query, id, user,  callback){
    
    Question.find({survey: id})
        .populate('survey')
        .sort({ sequence_question: query.sort })
        .exec()
        .then(question =>{
           let res = question.map(q => q.SurveyQuestion(params = null))
           return callback(null, res)        
        }).catch(err => callback(err, question))
    
}


function beforeSaveQustion(user, survey, callback){
  
    let survey_id = survey.id
    let survey_count_question = survey.count_question
    
    Survey.findByIdAndUpdate(survey_id, {question:[]}, (err, result) =>{
        console.log("update question field on survey to null");
            if(err)
                throw err

        Question.deleteMany({survey: survey_id}, (err) =>{
            console.log('delete question by survey id');
            
            if(err)
                throw err
            
            return callback(null, {msg: 'deleted'})
        })
    })

}


function getSurveyByUrl(id, callback) {
    Survey.findById(id)
        .populate('question')
        .populate('author')
        .exec()
        .then(survey => {
            return callback(null, survey)
        }).catch(err => callback(err, survey));
}


function getQuestionSurveyByUrl(query, id, callback) {
    
    Question.find({ survey: id })
        .populate('survey')
        .sort({ sequence_question: query.sort })
        .exec()
        .then(question => {
            let res = question.map(q => q.SurveyQuestion(params = null))
            return callback(null, res)
        }).catch(err => callback(err, question))
}


module.exports = [
    {
        name: 'services.questions.createQuestion',
        method: createQuestion
    },
    {
        name: 'services.questions.getSurveyById',
        method: getSurveyById
    },
    {
        name: 'services.questions.getQuestionBySurveyId',
        method: getQuestionBySurveyId
    },
    {
        name: 'services.questions.beforeSaveQustion',
        method: beforeSaveQustion
    },
    {
        name: 'services.questions.getSurveyByUrl',
        method: getSurveyByUrl
    },
    {
        name: 'services.questions.getQuestionSurveyByUrl',
        method: getQuestionSurveyByUrl
    }
]