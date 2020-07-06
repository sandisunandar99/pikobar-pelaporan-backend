'use strict';
const validatePost = (raw_payload) => {
    if (raw_payload.current_hospital_id == "") {
        raw_payload.current_hospital_id = null;
    }

    if (raw_payload.first_symptom_date == "") {
        raw_payload.first_symptom_date = Date.now();
    }

    return raw_payload
};

const generateIdCase = (author, pre) => {
    let date = new Date().getFullYear().toString();
    let id_case;

    if (author.role === 'faskes') {
        id_case = "precovid-";
        id_case += pre.count_case_pending.dinkes_code;
        id_case += date.substr(2, 2);
        id_case += "0".repeat(5 - pre.count_case_pending.count_pasien.toString().length);
        id_case += pre.count_case_pending.count_pasien;
    } else {
        id_case = "covid-";
        id_case += pre.count_case.dinkes_code;
        id_case += date.substr(2, 2);
        id_case += "0".repeat(4 - pre.count_case.count_pasien.toString().length);
        id_case += pre.count_case.count_pasien;
    }

    return id_case;
}

module.exports = {
    validatePost, generateIdCase,
}