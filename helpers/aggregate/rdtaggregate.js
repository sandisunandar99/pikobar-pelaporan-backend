const { searching, filterSplit } = require("./func/filter")
const { grupFunc } = require("./func")

const conditionSummary = async (query, user) => {
  const search = await searching(query, user)
  const filter = filterSplit(query, 'test_tools', 'final_result', 'tool_tester')
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