const Case = require('../../models/Case')

const findUserCases = async(data) => {
  const user = data.user
  const cases = await Case.aggregate([
    { $match :{ $or :[{nik: user.nik},{phone_number: user.phone_number}]}},
    { $lookup :{from: "histories", localField: 'last_history', foreignField: '_id', as: 'histories' }},
    { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$histories", 0 ] }, "$$ROOT" ] } }},
    { $project : {histories: 0}},
    { $limit: (1)}
  ])
  return (cases.length > 0 ? cases : null)
}


module.exports = {
  findUserCases
}

