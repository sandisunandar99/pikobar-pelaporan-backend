'use strict';
const { CASE, ROLE } = require('../../constant');
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
    let dates = new Date().getFullYear().toString().substring(2);
    let id_case;
    let pasienCount ='';
    let pendingCount = '';
    let dinkesCode = pre.count_case_pending.dinkes_code;
    if (author.role === ROLE.FASKES) {
        pasienCount = "0".repeat(5 - pre.count_case_pending.count_pasien.toString().length);
        pendingCount = pre.count_case_pending.count_pasien;
        id_case = `${CASE.PRE}${dinkesCode}${dates}${pasienCount}${pendingCount}`;
    } else {
        pasienCount = "0".repeat(4 - pre.count_case.count_pasien.toString().length);
        pendingCount = pre.count_case.count_pasien;
        id_case = `${CASE.CODE}${dinkesCode}${dates}${pasienCount}${pendingCount}`;
    }

    return id_case;
}

module.exports = {
    validatePost, generateIdCase,
}