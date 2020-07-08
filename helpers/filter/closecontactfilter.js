'use strict';
const filterCloseContact = (query, user) => {
    let params = {}
    if (query.gender) {
        params.gender = query.gender;
    }
    if (query.is_reported) {
        params.is_reported = query.is_reported;
    }
    return params;
};

const filterSearch = (query) => {
    let search_params = {};
    if(query.search){ 
        search_params = [
            { name: new RegExp(query.search, "i") }
        ];
    }
    return search_params;
}; 

module.exports = {
    filterCloseContact, filterSearch
}