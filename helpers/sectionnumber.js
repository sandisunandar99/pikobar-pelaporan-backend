const Check = require('../helpers/rolecheck')
const Filter = require('../helpers/filter/casefilter')
const { sumFuncNoMatch } = require('../helpers/aggregate/func')
const { dateFilter } = require('../helpers/filter/date')

const paramPositif = [
  { $eq: ["$tool_tester", "PCR"] },
  { $eq: ["$final_result", "POSITIF"] }
]
const paramNegatif = [
  { $eq: ["$tool_tester", "PCR"] },
  { $eq: ["$final_result", "NEGATIF"] }
]
const paramInvalid = [
  { $eq: ["$tool_tester", "PCR"] },
  { $eq: ["$final_result", "INVALID"] }
]
const paramReaktif = [
  { $eq: ["$tool_tester", "RDT"] },
  { $eq: ["$final_result", "REAKTIF"] }
]
const paramNon= [
  { $eq: ["$tool_tester", "RDT"] },
  { $eq: ["$final_result", "NON REAKTIF"] }
]
const paramIn= [
  { $eq: ["$tool_tester", "RDT"] },
  { $eq: ["$final_result", "INKONKLUSIF"] }
]

const groups = {
  $group: {
    _id: 'data',
    PCR: sumFuncNoMatch([{ $eq: ["$tool_tester", "PCR"] }]),
    PCR_POSITIF: sumFuncNoMatch(paramPositif),
    PCR_NEGATIF: sumFuncNoMatch(paramNegatif),
    PCR_INVALID: sumFuncNoMatch(paramInvalid),
    RDT: sumFuncNoMatch([{ $eq: ["$tool_tester", "RDT"] }]),
    RDT_REAKTIF: sumFuncNoMatch(paramReaktif),
    RDT_NON_REAKTIF: sumFuncNoMatch(paramNon),
    RDT_INKONKLUSIF: sumFuncNoMatch(paramIn)
  }
}

const projectResult = {
  _id: 0,
  TOTAL: { $sum: ["$RDT", "$PCR"] },
  PCR: 1,
  PCR_POSITIF: 1,
  PCR_NEGATIF: 1,
  PCR_INVALID: 1,
  RDT: 1,
  RDT_REAKTIF: 1,
  RDT_NON_REAKTIF: 1,
  RDT_INKONKLUSIF: 1
}

const summaryInputTest = (user, query) => {
  const search = Check.countByRole(user)
  const filter = Filter.filterRdt(user, query)
  const searching = Object.assign(search, filter)
  const test_date = dateFilter(query, "test_date")
  const queryInputTest = [
    {
      $match: {
        $and: [
          searching,
          { "status": { $ne: 'deleted' } },
          test_date
        ]
      },
    },
    {
      ...groups
    },
    {
      $project: projectResult
    }
  ]
  return queryInputTest
}

module.exports = {
  summaryInputTest
}