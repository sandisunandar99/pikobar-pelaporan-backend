// requirement func to generate id case to support multiple insertion cases
const getCountBasedOnDistrict = async (services, districtCode) => {
  const doc = {
    count_case: {},
    count_case_pending: {},
    case_count_outside_west_java: {},
  }

  await services.cases.getCountByDistrict(
    districtCode,
    (err, res) => {
      if (err) return
      doc.count_case = res
    })

  await services.cases.getCountPendingByDistrict(
    districtCode,
    (err, res) => {
      if (err) return
      doc.count_case_pending = res
    })

  await services.v2.cases.getCaseCountsOutsideWestJava(
    districtCode,
    (err, res) => {
      if (err) return
      doc.case_count_outside_west_java = res
    })

  return doc
}

const summaryCondition = (item, condition, result, param) => {
  if (item['_id'] == condition) {
    return result[param] = item['total']
  }
}

const thisUnitCaseAuthors = async (user, condition) => {
  const User = require('../../models/User')
  const { ROLE } = require('../constant')
  let caseAuthors = []
  if (user.role === ROLE.FASKES && user.unit_id) {
    caseAuthors = await User.find(condition).select('_id')
    caseAuthors = caseAuthors.map(obj => obj._id)
  }
  return caseAuthors
}

module.exports = {
  getCountBasedOnDistrict, summaryCondition, thisUnitCaseAuthors
}
