'use strict';
const Cases = require('../../../models/Case');
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

const generateIdCase = async (author, pre) => {
    let dates = moment(new Date()).format("YY");
    let id_case;
    let finalCount;
    let finalIdCase;
    let pasienCount ='';
    let pendingCount = '';
    let dinkesCode = pre.count_case_pending.dinkes_code;
    let zero = '0';
    let faskesCode = pre.count_case_pending.count_pasien.toString().length;
    let otherCode = pre.count_case.count_pasien.toString().length;
    /* check jika id kasus sudah ada pengecekan ini berlaku 
       jika user menginput yang bukan wilayahnya
    */
    if (author.role === ROLE.FASKES) {
        pasienCount = zero.padStart(5 - faskesCode, 0);
        pendingCount = pre.count_case_pending.count_pasien;
        id_case = `${CASE.PRE}${dinkesCode}${dates}${pasienCount}${pendingCount}`;
        finalCount = await checkIdCase(id_case, pendingCount);
        finalIdCase = `${CASE.PRE}${dinkesCode}${dates}${pasienCount}${finalCount}`;
    } else {
        pasienCount = zero.padStart(4 - otherCode, 0);
        pendingCount = pre.count_case.count_pasien;
        id_case = `${CASE.CODE}${dinkesCode}${dates}${pasienCount}${pendingCount}`;
        finalCount = await checkIdCase(id_case, pendingCount);
        finalIdCase = `${CASE.CODE}${dinkesCode}${dates}${pasienCount}${finalCount}`;
    }
    return finalIdCase;
}

const checkIdCase = async (id_case, pendingCount) => {
    const checkData =  await Cases.findOne({'id_case':id_case}).countDocuments();
    return (checkData ? Number(pendingCount) + 1 : pendingCount);
}

module.exports = {
    validatePost, generateIdCase,
}