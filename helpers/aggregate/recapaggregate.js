const { sumFunc } = require("./func/recapfunc")
const recapCondition = (grouping, criteria) => {
  const params = {
    $group: {
      _id: grouping,
      confirmed: sumFunc(criteria),
      probable: sumFunc(criteria),
      suspect: sumFunc(criteria),
      closecontact: sumFunc(criteria)
    }
  }
  return params
}

module.exports = { recapCondition }