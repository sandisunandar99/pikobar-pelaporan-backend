const { searching, rdtFilter } = require("./func/filter")
const { grupFunc } = require("./func")

const conditionSummary = async (query, user) => {
  const search = await searching(query, user)
  const filter = rdtFilter(query)
  const conditions = [{
    $match: {
      $and: [search, { ...filter }]
    }
  },
  {
    "$facet": {
      "targets": [grupFunc([search, { ...filter }], '$target')],
    }
  },
  {
    "$project": {
      "targets": "$targets"
    }
  }]
  return conditions
}

module.exports = {
  conditionSummary
}