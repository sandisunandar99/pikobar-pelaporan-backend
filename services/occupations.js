const mongoose = require('mongoose')

require('../models/Occupation')
const Occupation = mongoose.model('Occupation')

function getOccupationList(request,callback) {
    var params = null
    if (request.title) {
         params = {title: request.title}
    }

    Occupation.find()
        .sort({ seq: 'asc' })
        .exec()
        .then(result => {
            let res = result.map(q => q.toJSONFor())
            return callback(null, res)
        })
        .catch(err => callback(err, null))
}

function getOccupationDetail(code,callback) {
    function getCaseById (id, callback) {
      Occupation.findOne({_id: id})
        .exec()
        .then(cases => callback (null, cases))
        .catch(err => callback(err, null));
    }
}


module.exports = [
    {
        name: 'services.occupations.getOccupation',
        method: getOccupationList
    },
    {
        name: 'services.occupations.getOccupationDetail',
        method: getOccupationDetail
    }
]
