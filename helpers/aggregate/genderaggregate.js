const { matchWhere } = require("./globalcondtion")
const genderCondition = (query, searching, where, criteria) => {
  let matchs = matchWhere(query, searching, where, criteria)
  const paramsGender = [
    matchs,
    { $group: { _id: "$gender", "total": { $sum: 1 }}}
  ]

  return paramsGender
}

const nationalityCondition = (query, searching, where, criteria) => {
  let matchs = matchWhere(query, searching, where, criteria)
  const paramsNationality = [
    matchs,
    { $group: { _id: "$nationality", "total": { $sum: 1 }}}
  ]

  return paramsNationality
}

module.exports = {
  genderCondition, nationalityCondition
}