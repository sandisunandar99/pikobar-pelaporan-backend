const helpers = require("../custom")
const { dateFilter } = require("../filter/date")
const { histories, author } = require("../export/cases/lookup")
const { sectionIdentity, sectionInfo, sectionClinic } = require("../export/cases/column")
const { columnIdentity, columnInfo, columnAuthor } = require("../export/cases/select_column")
const { checkExistColumn } = require("../../helpers/custom")

const excellOutput = (this_) => {
  return {
    "Kode Kasus" : checkExistColumn(this_.id),
    ...sectionIdentity(this_),
    ...sectionInfo(this_),
    ...helpers.checkDiagnosis(this_.diagnosis),
    "Gejala Lainnya": helpers.checkExistColumn(this_.diagnosis_other),
    ...helpers.checkDiseases(this_.diseases),
    ...sectionClinic(this_)
  }
}

const sqlCondition = (params, search, query) => {
  const limit = parseInt(query.limit) || 100
  const page = parseInt(query.page) || 1
  let searching = Object.keys(search).length == 0 ? [search] : search
  let createdAt = dateFilter(query, "createdAt")
  let andParam = { ...createdAt, ...params }
  return [
    {
      $match: {
        $and : [ andParam ],
        $or : searching
      }
    },
    { ...author }, { ...histories },
    { $sort: { "history_list._id": -1, "cases._id": -1 } },
    { $unwind: '$author_list' },{ $unwind: '$history_list' },
    { $skip: (limit * page) - limit }, { $limit: limit},
    {
      "$project": {
        ...columnInfo,
        ...columnIdentity,
        ...columnAuthor
      }
    }
  ]
}

module.exports = {
  excellOutput, sqlCondition
}