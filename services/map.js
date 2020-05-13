const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');
const Check = require('../helpers/rolecheck');
const Filter = require('../helpers/casefilter');

const listMap = async (query, user, callback) => {
    try {
        const search = Check.countByRole(user);
        const filter = await Filter.filterCase(user, query);
        const searching = Object.assign(search, filter);
        const result = await Case.find(searching).where("delete_status").ne("deleted");
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

