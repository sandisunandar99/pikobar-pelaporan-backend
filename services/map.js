const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');
const Check = require('../helpers/rolecheck');
const Filter = require('../helpers/filter/casefilter');

const listMap = async (query, user, callback) => {
    try {
        const search = Check.countByRole(user);
        const filter = await Filter.filterCase(user, query);
        const searching = Object.assign(search, filter);
        const res = await Case.find(searching).where("delete_status").ne("deleted");
        const result = res.map(r => {
            r.id = res._id;
            r.kode_kab = res.address_district_code;
            r.nama_kab = res.address_district_name;
            r.kode_kec = res.address_subdistrict_code;
            r.nama_kec = res.address_subdistrict_name;
            r.kode_kel = res.address_village_code;
            r.nama_kel = res.address_village_name;
            r.status = res.status;
            r.stage = (res.stage == 0 ? "Prosess" : "Selesai")
            r.umur = res.age;
            r.gender = res.gender;
            r.longitude = '';
            r.latitude = '';
            r.tanggal_konfirmasi = res.createdAt;
            r.tanggal_update = res.updatedAt;
            return r;
        })
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

