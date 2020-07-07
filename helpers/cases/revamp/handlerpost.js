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
    let faskesCode = pre.count_case_pending.count_pasien.toString();
    let maskedNumber = faskesCode.length.padStart(5, 0);
    let otherCOde = pre.count_case.count_pasien.toString();
    let otherMaskedNumber = otherCOde.length.padStart(4, 0);
    let dinkesCode = pre.count_case_pending.dinkes_code;
    if (author.role === ROLE.FASKES) {
        pasienCount = maskedNumber;
        pendingCount = pre.count_case_pending.count_pasien;
        id_case = `${CASE.PRE}${dinkesCode}${dates}${pasienCount}${pendingCount}`;
    } else {
        pasienCount = otherMaskedNumber;
        pendingCount = pre.count_case.count_pasien;
        id_case = `${CASE.CODE}${dinkesCode}${dates}${pasienCount}${pendingCount}`;
    }

    return id_case;
}

module.exports = {
    validatePost, generateIdCase,
}