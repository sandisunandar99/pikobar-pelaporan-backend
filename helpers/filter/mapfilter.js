'use strict';
const https = require('https');

const httprequest = (url) => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, (res) => {
      let body = [];
      res.on('data', function (chunk) {
        body.push(chunk);
      });
      res.on('end', function () {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (e) {
          reject(e);
        }
        resolve(body.data);
      });
    });
    req.on('error', (e) => {
      reject(e.message);
    });
    req.end();
  });
}

function delay(t) {
  return new Promise(resolve => setTimeout(resolve.bind(), t))
}


const promiseLong = async (codeLong) => {
  let promise = Promise.resolve();
  promise = delay(100);
  const getLong = await httprequest(`${process.env.APP_CONVERT}${codeLong}`);
  return promise.then(async () => {
    if (getLong.longitude == null) return delay(10000);
    return new Promise(resolve => resolve(getLong.longitude));
  })
};

const promiseLat = async (codeLat) => {
  let promise = Promise.resolve();
  promise = delay(100);
  const getLat = await httprequest(`${process.env.APP_CONVERT}${codeLat}`);
  return promise.then(async () => {
    if (getLat.latitude == null) return delay(10000);
    return new Promise(resolve => resolve(getLat.latitude));
  })
}

const filterOutput = async (this_) => {
  let finalResult;
  if (this_.final_result == 1) {
    finalResult = 'Sembuh';
  } else if (this_.final_result == 2) {
    finalResult = 'Meninggal';
  } else if (this_.final_result == '' || this_.final_result == null || this_.final_result == 0) {
    finalResult = 'Aktif';
  } else {
    finalResult = '';
  }
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
    umur: this_.age,
    gender: this_.gender,
    final_result: finalResult,
    longitude: await promiseLong(this_.address_village_code),
    latitude: await promiseLat(this_.address_village_code),
    tanggal_konfirmasi: this_.createdAt,
    tanggal_update: this_.updatedAt,
  }
};

const filterDefault = (query) => {
  let queryStrings;
  if (query.status_patient) {
    const splits = query.status_patient.split('-');
    if (splits[0] == "POSITIF" && splits[1] !== "3") {
      queryStrings = { "status": splits[0], "final_result": splits[1] }
    } else if (splits[0] == "POSITIF" && splits[1] == "3") {
      queryStrings = { "status": splits[0] }
    } else if (query.status_patient == "all") {
      queryStrings = {};
    } else {
      queryStrings = { "status": splits[0], "stage": splits[1] }
    }
  } else {
    queryStrings = {
      "status": "POSITIF",
      "final_result": { "$in": [null, "", "0"] }
    };
  }
  return queryStrings;
}

module.exports = {
  filterOutput, filterDefault
}