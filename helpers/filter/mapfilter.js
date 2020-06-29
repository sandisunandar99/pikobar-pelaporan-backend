'use strict';
const https = require('https');

const httprequest = (url) => {
 return new Promise((resolve, reject) => {
    const req = https.request(url, (res) => {
        let body = [];
        res.on('data', function(chunk) {
            body.push(chunk);
        });
        res.on('end', function() {
            try {
                body = JSON.parse(Buffer.concat(body).toString());
            } catch(e) {
                reject(e);
            }
            resolve(body);
        });
    });
    req.on('error', (e) => {
      reject(e.message);
    });
   req.end();
});
}

const promiseLong = async (code) => {
    const convertString = code.replace(/\./g,'');
    const getLong = await httprequest(`${process.env.APP_CONVERT}${convertString}`).then((data) => {
        const response = data
        return response.data;
    });

    return getLong.longitude;
};

const promiseLat = async (code) => {
    const convertString = code.replace(/\./g,'');
    const getLong = await httprequest(`${process.env.APP_CONVERT}${convertString}`).then((data) => {
        const response = data
        return response.data;
    });

    return getLong.latitude;
}

const filterOutput = async (this_) => {
    return {
        _id: this_._id,
        id: this_.id_case,
        kode_kab: this_.address_district_code,
        nama_kab: this_.address_district_name,
        kode_kec: this_.address_subdistrict_code,
        nama_kec: this_.address_subdistrict_name,
        kode_kel: this_.address_village_code,
        nama_kel: this_.address_village_name,
        status: this_.status,
        stage: (this_.stage == 0 ? "Prosess" : "Selesai"),
        umur: this_.age,
        gender: this_.gender,
        longitude: await promiseLong(this_.address_subdistrict_code),
        latitude: await promiseLat(this_.address_subdistrict_code),
        tanggal_konfirmasi: this_.createdAt,
        tanggal_update: this_.updatedAt,
    }
};

module.exports = {
    filterOutput
}