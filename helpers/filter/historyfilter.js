const helpers = require("../custom")
const { dateFilter } = require("../filter/date")
const { casesHistory, author } = require("../export/cases/lookup")
const { columnIdentityClinic, columnInfo, columnAuthor } = require("../export/cases/select_column")
const { combineInfo, sectionOthers } = require("../export/histories/column")

const excellHistories = (this_) => {
  const mapingColumn = {
    ...combineInfo(this_),
    ...helpers.checkDiagnosis(this_.diagnosis),
    "Gejala Lainnya": helpers.checkExistColumn(this_.diagnosis_other),
    ...helpers.checkDiseases(this_.diseases),
    ...sectionOthers(this_),
  }

  return mapingColumn
}

const condition = (params, search, query) => {
  const limit = parseInt(query.limit) || 100
  const page = parseInt(query.page) || 1
  let searching = Object.keys(search).length == 0 ? [search] : search
  // let createdAt = dateFilter(query, "createdAt")
  let andParam = { ...params }
  console.log(JSON.stringify([
    { $match: { $and: [andParam], $or: searching } },
    { ...casesHistory }, { ...author },
    { $sort: { "histories._id": -1, "histories.updatedAt": -1, "histories.last_date_status_patient":-1 } },
    { $skip: (limit * page) - limit }, { $limit: limit},
    {
      $project: {
        histories: {
          ...columnInfo,
        ...columnIdentityClinic,
        ...columnAuthor
        }
      }
    },
    {
      $unwind: "$histories"
    },
    { $replaceRoot: { newRoot: "$histories" } }
  ]));
  return [
    { $match: { $and: [andParam], $or: searching } },
    { ...casesHistory }, { ...author },
    { $sort: { "histories.updatedAt": -1, "histories.last_date_status_patient":-1 } },
    { $skip: (limit * page) - limit }, { $limit: limit},
    {
      $project: {
        histories: {
          ...columnInfo,
        ...columnIdentityClinic,
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