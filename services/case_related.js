const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');
const Check = require('../helpers/rolecheck');
const Filter = require('../helpers/filter/casefilter');

const listCaseRelated = async (query, user, callback) => {
  try {
    const whereRole = Check.countByRole(user);
    const filter = await Filter.filterCase(user, query);
    const condition = Object.assign(whereRole, filter);
    const staticParam = {
      "delete_status": { "$ne": "deleted" },
      "id_case_related": { "$nin": [null, "", ''] },
    };
    const searching = Object.assign(condition, staticParam);
    const res = await Case.find({ $or: [searching] });
    const resultEdges = res.map(rowEdges => rowEdges.EdgesOutput());
    const resultNodes = res.map(rowNodes => rowNodes.NodesOutput());
    const resultJson = {
      "edges": resultEdges,
      "nodes": resultNodes,
    };
    callback(null, resultJson);
  } catch (error) {
    callback(error, null);
  }
}

const getByCaseRelated = async (id_case, callback) => {
  try {
    const result = await Case.findOne({ 'id_case': id_case });
    callback(null, result);
  } catch (error) {
    callback(error, null);
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

