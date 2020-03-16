const mongoose = require('mongoose')

require('../models/Survey')
const Survey = mongoose.model('Survey')


function getListSurvey(user, query, callback){  
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
        populate: 'author',
        leanWithId: true,
        customLabels: myCustomLabels
    };

    let query_search = new RegExp(query.search, "i")
    let result_search = Survey.find({ survey_name: query_search })
                            .where('status').ne('Deleted')

    Survey.paginate(result_search, options).then(function(results){

        let res = { 
            surveys: results.itemsList.map(survey => survey.toJSONFor(user)),
            _meta: results._meta
        }
        return callback(null, res)
    }).catch(err => callback(err, null))

    // return Promise.join(
    //     Survey.find()
    //         .limit(Number(query.limit))
    //         .skip(Number(query.offset))
    //         .sort({ createdAt: 'desc' })
    //         .populate('author')
    //         .exec(),(surveys) => {
    //         console.log(surveys.map(survey =>survey.toJSONFor(user)));
                
    //             let results = { surveys: surveys.map(survey => survey.toJSONFor(user)) }            
    //             return callback(null, results)
    //         } 
    // ).catch(err => callback(err, null))
}


function createSurvey(author, payload, callback){
    let survey = new Survey(Object.assign(payload, {author}))    
    survey.save((err, saveSurvey) =>{
        if(err)return callback(err, null)
        return callback(null, saveSurvey)
    })
}


function getbySurveyId(id, callback){
    Survey.findById(id)
    .populate('author')
    .exec()
    .then(survey => callback (null, survey))
    .catch(err => callback(err, null));
}


function deleteSurvey (survey, callback){
    survey.remove().then(removeSurvey =>{
        return callback(null, removeSurvey)
    }).catch(err => callback(err, null))
}


function udpateSurvey(survey, payload, callback) {
    survey = Object.assign(survey, payload)
    survey.save((err, saveSurvey)=>{
        if(err) return callback(err, null)
        return callback (null, saveSurvey)
    })
}


function softDeleteSurveybyID(survey, payload, callback) {
    let date = new Date()
    let dates = { deletedAt: date.toISOString()}
    let param = Object.assign(payload, dates)

    survey = Object.assign(survey, param)
    
    survey.save((err, saveSurvey)=>{
        if(err) return callback(err, null)
        return callback (null, saveSurvey)
    })
}


module.exports = [
    {
        name: 'services.surveys.getListSurvey',
        method: getListSurvey
    },
    {
        name: 'services.surveys.createSurvey',
        method: createSurvey
    },
    {
        name: 'services.surveys.getbyIDSurvey',
        method: getbySurveyId
    },
    {
        name: 'services.surveys.deleteSurvey',
        method: deleteSurvey
    },
    {
        name: 'services.surveys.udpateSurvey',
        method: udpateSurvey
    },
    {
        name: 'services.surveys.softDeleteSurveybyID',
        method: softDeleteSurveybyID
    }
]
