const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');
const Check = require('../helpers/rolecheck');
const Filter = require('../helpers/filter/casefilter');
const _ = require('lodash');

const listCaseRelated = async (query, user, callback) => {
    try {
        const whereRole = Check.countByRole(user);
        const filter = await Filter.filterCase(user, query);
        const condition = Object.assign(whereRole, filter);
        const staticParam = {
            "delete_status":{"$ne":"deleted"},
            "id_case_related":{"$nin":[null,"",'']},
        };
        const searching = Object.assign(condition, staticParam);
        const res = await Case.find({$or: [searching]});
        const result = _.groupBy(res, 'id_case_related');
        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

module.exports = [
    {
        name: 'services.case_related.list',
        method: listCaseRelated
    }
];

