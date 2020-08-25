const Case = require('../models/Case')
const Check = require('../helpers/rolecheck')
const Filter = require('../helpers/filter/casefilter')
const { WHERE_GLOBAL } = require('../helpers/constant')
const { filterEdges, filterNodes } = require('../helpers/filter/relatedfilter')
const { patientStatus } = require('../helpers/custom')

const listCaseRelated = async (query, user, callback) => {
  try {
    const whereRole = Check.countByRole(user)
    const filter = await Filter.filterCase(user, query)
    const condition = Object.assign(whereRole, filter)
    const staticParam = { ...WHERE_GLOBAL, "id_case_related": { "$nin": [null, "", ''] } }
    const searching = { ...condition, ...staticParam }
    const aggregateCondition = [
      {
        $match: searching
      },
      {
        $lookup: {
          from: "cases",
          localField: "id_case_related",
          foreignField: "id_case",
          as: "cases_related"
        }
      },
      {
        "$project": {
          "_id": 1,
          "id_case": "$id_case",
          "id_case_related": "$id_case_related",
          "gender": "$gender",
          "status": "$status",
          "age": "$age",
          "final_result": "$final_result",
          "cases_related" : "$cases_related"
        }
      }
    ]
    const res = await Case.aggregate(aggregateCondition)
    const resultEdgesFrom = res.map(rowEdgesFrom => filterEdges(rowEdgesFrom))
    const resultEdgesTo = res.map(rowEdgesTo => rowEdgesTo.cases_related).filter(e => e.length)
    // maping array dimensional
    const output = resultEdgesTo.map(([s_id]) => (filterEdges(s_id)))
    // filter remove duplicate
    const filterOutput = output.reduce((unique, o) => {
      if (!unique.some(obj => obj.label === o.label && obj.value === o.value)) {
        unique.push(o)
      }
      return unique
    }, [])
    // combine array object
    const resultEdges = resultEdgesFrom.concat(filterOutput)
    const resultNodes = res.map(rowNodes => filterNodes(rowNodes))
    const resultJson = {
      "edges": resultEdges,
      "nodes": resultNodes
    };
    callback(null, resultJson)
  } catch (error) {
    callback(error, null)
  }
}

const getByCaseRelated = async (id_case, callback) => {
  const wheres = { ...WHERE_GLOBAL, 'id_case': id_case }
  try {
    const conditionAggregate = [
      {
        $match: wheres
      },
      {
        $lookup: {
          from: "histories",
          localField: "last_history",
          foreignField: "_id",
          as: "history"
        }
      },
      { $unwind: '$history' },
      {
        "$project": {
          "_id": 1,
          "id_case": "$id_case",
          "status": "$status",
          "age": "$age",
          "gender": "$gender",
          "final_result": "$final_result",
          "first_symptom_date": "$history.first_symptom_date",
          "current_location_address" : "$history.current_location_address"
        }
      }
    ]
    const result = await Case.aggregate(conditionAggregate)
    result.map(res => {
      res.final_result = patientStatus(res)
    })
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.case_related.list',
    method: listCaseRelated,
  },
  {
    name: 'services.case_related.getById',
    method: getByCaseRelated,
  },
];

