const Check = require('../helpers/rolecheck')
const Filter = require('../helpers/filter/casefilter')
const { sumFuncOne, sumFuncTwo } = require('../helpers/aggregate/func')
const { dateFilter } = require('../helpers/filter/date')

const groups = {
  $group: {
    _id: 'data',
    PCR: sumFuncOne("$tool_tester", "PCR"),
    PCR_POSITIF: sumFuncTwo("$tool_tester", "PCR", "$final_result", "POSITIF"),
    PCR_NEGATIF: sumFuncTwo("$tool_tester", "PCR", "$final_result", "NEGATIF"),
    PCR_INVALID: sumFuncTwo("$tool_tester", "PCR", "$final_result", "INVALID"),
    RDT: sumFuncOne("$tool_tester", "RDT"),
    RDT_REAKTIF: sumFuncTwo("$tool_tester", "RDT", "$final_result", "REAKTIF"),
    RDT_NON_REAKTIF: sumFuncTwo("$tool_tester", "RDT", "$final_result", "NON REAKTIF"),
    RDT_INKONKLUSIF: sumFuncTwo("$tool_tester", "RDT", "$final_result", "INKONKLUSIF")
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

const summaryInputTest = async (user, query) => {
  const search = Check.countByRole(user)
  const filter = await Filter.filterRdt(user, query)
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