const { countByRole, thisUnitCaseAuthors } = require('../rolecheck')
const { CRITERIA, ROLE } = require('../constant')
const { sumFuncNoMatch } = require("./func")

const lookup = {
  $lookup: {
    from: 'histories',
    localField: 'last_history',
    foreignField: '_id',
    as: 'last_history'
  }
}

const parseEquivalent = (criteria, result) => {
  return [
    { $eq: ['$status', criteria] },
    { $eq: ['$final_result', result] }
  ]
}

const groupConfrimed = {
  $group: {
    _id: 'confrimed',
    sick_home: sumFuncNoMatch([
      { $eq: ['$final_result', '4'] },
      { $eq: ['$status', CRITERIA.CONF] },
      { $eq: ['$last_history.current_location_type', 'RUMAH'] },
    ]), sick_hospital: sumFuncNoMatch([
      { $eq: ['$final_result', '4'] },
      { $eq: ['$status', CRITERIA.CONF] },
      { $in: ["$last_history.current_location_type", ["RS", "OTHERS"]] }
    ]),
    recovered: sumFuncNoMatch(parseEquivalent(CRITERIA.CONF, '1')),
    decease: sumFuncNoMatch(parseEquivalent(CRITERIA.CONF, '2'))
  }
}

const groupProbable = {
  $group: {
    _id: 'probable',
    sick: sumFuncNoMatch([
      { $eq: ['$final_result', '4'] },
      { $eq: ['$status', CRITERIA.PROB] },
    ]),
    recovered: sumFuncNoMatch(parseEquivalent(CRITERIA.PROB, '1')),
    decease: sumFuncNoMatch(parseEquivalent(CRITERIA.PROB, '2')),
  }
}

const groupSame = (id, param, criteria, resultone, resulttwo) => {
  return {
    $group: {
      _id: id,
      [param]: sumFuncNoMatch(parseEquivalent(criteria, resultone)),
      discarded: sumFuncNoMatch(parseEquivalent(criteria, resulttwo)),
    }
  }
}

const filterRole = (caseAuthors, query, user) => {
  let searching = countByRole(user, caseAuthors)

  if (user.role === ROLE.PROVINCE || user.role === ROLE.ADMIN) {
    if (query.address_district_code) {
      searching.address_district_code = query.address_district_code
    }
  }

  return searching
}

const filtering = (caseAuthors, query, user) => {

  let searching = filterRole(caseAuthors, query, user)

  if (query.address_village_code) {
    searching.address_village_code = query.address_village_code
  }

  if (query.address_subdistrict_code) {
    searching.address_subdistrict_code = query.address_subdistrict_code
  }

  return searching
}

const topAggregate = async (query, user) => {
  const caseAuthors = await thisUnitCaseAuthors(user)
  const filter = filtering(caseAuthors, query, user)
  const conditions = [
    {
      $match: {
        $and: [filter, { delete_status: { $ne: 'deleted' }, verified_status: 'verified' }]
      }
    }, lookup, { $unwind: '$last_history' },
    {
      "$facet": {
        'confirmed': [ groupConfrimed ],
        'probable': [ groupProbable ],
        'suspect': [ groupSame('suspect', 'sick', CRITERIA.SUS, '4', '3') ],
        'closeContact': [ groupSame('closeContact', 'quarantine', CRITERIA.CLOSE, '5', '3') ],
      }
    },
    {
      "$project": {
        "confirmed": "$confirmed",
        "probable": "$probable",
        "suspect": "$suspect",
        "closeContact": "$closeContact"
      }
    },
  ]
  return conditions
}

module.exports = {
  topAggregate
}