'use strict';
const Conf = require('../../constant.json');
const validatePost = (raw_payload) => {
    if (raw_payload.current_hospital_id === "") {
        raw_payload.current_hospital_id = null;
    }

    if (raw_payload.first_symptom_date === "") {
        raw_payload.first_symptom_date = Date.now();
    }

    return raw_payload;
};

const generateIdCase = (author, pre) => {
    let date = new Date().getFullYear().toString();
    let id_case;
    let pasienCount ='';
    let pendingCount = '';
    let dinkesCode = pre.count_case_pending.dinkes_code;
    let dates = date.substr(2, 2);
    if (author.role === Conf.ROLE_2) {
        pasienCount = "0".repeat(5 - pre.count_case_pending.count_pasien.toString().length);
        pendingCount = pre.count_case_pending.count_pasien;
        id_case = `${Conf.CASE_CODE_PRE}${dinkesCode}${dates}${pasienCount}${pendingCount}`;
        
    } else {
        pasienCount = "0".repeat(4 - pre.count_case.count_pasien.toString().length);
        pendingCount = pre.count_case.count_pasien;
        id_case = `${Conf.CASE_CODE}${dinkesCode}${dates}${pasienCount}${pendingCount}`;
    }

    return id_case;
}

module.exports = {
    validatePost, generateIdCase,
}