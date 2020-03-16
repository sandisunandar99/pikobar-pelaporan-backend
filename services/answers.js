const mongoose = require('mongoose')

require('../models/Answer')
const Answer = mongoose.model('Answer')

require('../models/Survey')
const Survey = mongoose.model('Survey')


async function saveSurveyRespond(payload, survey, callback) {
    let answer = new Answer(Object.assign({ survey }, payload))
    
    await answer.save((err, saveAnswer) =>{
        if (err) return callback (err, null)

        return callback(null, saveAnswer)
    })
}


function getSurveyById(id, user, callback) {
    Survey.findById(id)
        .populate('author')
        .exec()
        .then(survey => {
            return callback(null, survey)
        }).catch(err => callback(err, null));
}

function getAnswerBySurveyId(id,query,callback) {  
    let find = Answer.find({ survey: id}).populate('survey')
    
    const myCustomLabels = {
        totalDocs: 'itemCount',
        docs: 'itemsList',
        limit: 'perPage',
        page: 'currentPage',
        meta: '_meta'
    };

    const options = {
        page: query.page,
        limit: query.limit,
        sort: { createdAt: query.sort },
        populate: 'survey',
        leanWithId: true,
        customLabels: myCustomLabels
    };

    Answer.paginate(find, options).then(function (results) {  
        let res = {
            answers: results.itemsList.map(q => q.JSONlistAnswer()),
            _meta: results._meta
        }
        return callback(null, res)
    }).catch(err => callback(err, null))
    
}

function countAnswerSurvey(id, callback) {
 
    Answer.find({ survey: id })
        .exec()
        .then(c =>{
            
            Survey.findByIdAndUpdate(id, { respondent_input: c.length }, (err,  result)=>{
                if(err) console.log(err);
            })
            
            return callback(null, c.length)
        })
        .catch(err => callback(err, null))
}



module.exports = [
    {
        name: 'services.answers.saveSurveyRespond',
        method: saveSurveyRespond
    },
    {
        name: 'services.answers.getSurveyById',
        method: getSurveyById
    },
    {
        name: 'services.answers.getAnswerBySurveyId',
        method: getAnswerBySurveyId
    },
    {
        name: 'services.answers.countAnswerSurvey',
        method: countAnswerSurvey
    }
]