const helpers = require("../custom")
const { dateFilter } = require("../export/cases/filter")
const { casesHistory } = require("../export/cases/lookup")
const { columnIdentity, columnInfo, columnAuthor } = require("../export/cases/select_column")
const { sectionIdentity, sectionClinic, sectionOthers } = require("../export/histories/column")

const excellHistories = (this_) => {
  const mapingColumn = {
    ...sectionIdentity(this_),
    ...sectionClinic(this_),
    ...helpers.checkDiagnosis(this_.diagnosis),
    "Gejala Lainnya": helpers.checkExistColumn(this_.diagnosis_other),
    ...helpers.checkDiseases(this_.diseases),
    ...sectionOthers(this_),
  }

  return mapingColumn
}

const condition = (params, search, query) => {
  let searching = Object.keys(search).length == 0 ? [search] : search
  let createdAt = dateFilter(query)
  let andParam = { ...createdAt, ...params }
  return [
    {
      $match: {
        $and: [andParam],
        $or: searching
      }
    },
    { casesHistory },
    { $sort: { "id_case": 1} },
    {
      $project: {
        histories: {
          ...columnInfo,
        ...columnIdentity,
        ...columnAuthor
        }
      }
    },
    {
      $unwind: "$histories"
    },
    { $replaceRoot: { newRoot: "$histories" } }
  ]
}

module.exports = {
  excellHistories, condition
}