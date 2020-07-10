'use strict';
const { CASE, ROLE } = require('../../constant');
const moment = require('moment');
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
    let dates = moment(new Date()).format("YY");
    let id_case;
    let pasienCount ='';
    let pendingCount = '';
    let dinkesCode = pre.count_case_pending.dinkes_code;
    let zero = '0';
    let faskesCode = pre.count_case_pending.count_pasien.toString().length;
    let otherCode = pre.count_case.count_pasien.toString().length;
    if (author.role === ROLE.FASKES) {
        pasienCount = zero.repeat(5 - faskesCode);
        pendingCount = pre.count_case_pending.count_pasien;
        id_case = `${CASE.PRE}${dinkesCode}${dates}${pasienCount}${pendingCount}`;
    } else {
        pasienCount = zero.repeat(4 - otherCode);
        pendingCount = pre.count_case.count_pasien;
        id_case = `${CASE.CODE}${dinkesCode}${dates}${pasienCount}${pendingCount}`;
    }

    return id_case;
}

module.exports = {
    validatePost, generateIdCase,
}