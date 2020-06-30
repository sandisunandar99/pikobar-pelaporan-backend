const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');
const check = require('../helpers/rolecheck');
const filter = require('../helpers/filter/casefilter');

const listMap = async (query, user, callback) => {
    try {
        const search = check.countByRole(user);
        const filters = await filter.filterCase(user, query);
        const searching = Object.assign(search, filters);
        const res = await Case.find(searching).where("delete_status").ne("deleted");
        const result = await Promise.all(res.map(r => r.MapOutput()));
        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

module.exports = [
    {
        name: 'services.map.listMap',
        method: listMap
    }
];

