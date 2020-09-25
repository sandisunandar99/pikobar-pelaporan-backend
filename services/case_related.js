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
    const staticParam = { ...WHERE_GLOBAL, "close_contact_parents": { $gt: [] } }
    const searching = { ...condition, ...staticParam }
    const select = {
      "_id": 1,
      "id_case": 1,
      "gender": 1,
      "status": 1,
      "age": 1,
      "final_result": 1,
    }
    const aggregateCondition = [
      {
        $match: searching
      },
      {
        $addFields: {
          case_related_ids: {
            $map: {
              input: "$close_contact_parents",
              as: "thisParent",
              in: "$$thisParent.close_contact_id_case"
            }
          }
        }
      },
      {
        $lookup: {
          from: "cases",
          localField: "case_related_ids",
          foreignField: "id_case",
          as: "cases_related"
        }
      },
      {
        "$project": {
          ...select,
          "cases_related" : {
            ...select
          }
        }
      }
    ]
    const res = await Case.aggregate(aggregateCondition)
    const resultEdgesFrom = res.map(rowEdgesFrom => filterEdges(rowEdgesFrom))
    const rawResultEdgesTo = res.map(rowEdgesTo => rowEdgesTo.cases_related).filter(e => e.length)
    const resultEdgesTo = [].concat.apply([], rawResultEdgesTo)

    // maping array dimensional
    const output = resultEdgesTo.map(s_id => filterEdges(s_id))
    // filter remove duplicate
    const filterOutput = output.reduce((unique, o) => {
      if (!unique.some(obj => obj.label === o.label && obj.value === o.value)) {
        unique.push(o)
      }
      return unique
    }, [])
    // combine array object
    const resultEdges = resultEdgesFrom.concat(filterOutput)
    const resultNodes = filterNodes(res)
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

