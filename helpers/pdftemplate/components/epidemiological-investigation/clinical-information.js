const moment = require('moment')
const {
  PATIENT_STATUS,
} = require('../../../constant')
const components = {
  symptoms: require('./symptoms'),
  diseases: require('./diseases'),
  treatment: require('./treatment'),
  diagnosis: require('./diagnosis'),
}

const render = (data) => {
  const isLocationTrue = (value) => {
    return  data.last_history.current_location_type === value ? '√' : '  '
  }

  const isLocationFalse = (value) => {
    return  data.last_history.current_location_type !== value ? '√' : '  '
  }

  const formattedDate = (d) => {
    return d ? moment(d).format('YYYY/MM/DD') : '-'
  }

  const patientStatuses = (status) => {
    let result;
    switch (status) {
      case '0': result = PATIENT_STATUS.NEGATIVE; break;
      case '1': result = PATIENT_STATUS.DONE; break;
      case '2': result = PATIENT_STATUS.DEAD; break;
      case '3': result = PATIENT_STATUS.DISCARDED; break;
      case '4': result = PATIENT_STATUS.SICK; break;
      case '5': result = PATIENT_STATUS.QUARANTINED; break;
      default: result = '-';
    }
    return result
  }

  return [
    {
      style: 'tableClinical',
      color: '#444',
      table: {
        widths: [112, 150, 80, 140],
        headerRows: 1,
        body: [
          [
            {
              text: 'B. INFORMASI KLINIS',
              style: 'tableHeader',
              colSpan: 4,
              alignment: 'left',
              borderColor: ['black', 'white', 'black', 'black'],
            },{},{},{}
          ],
          ...components.symptoms.render(data),
          [
            {
              text: 'Kondisi Penyerta',
              style: 'tableSubHeader',
              colSpan: 4,
              alignment: 'left'
            },{},{},{}
          ],
          components.diseases.render(data)
        ],
      },
      layout: {
        paddingTop: (i, node) => -0.2,
        paddingBottom: (i, node) => 0
      }
    },
    // layout.footnoteSectionOne,
    {
      style: 'tableClinical',
      margin: [0, 10, 0, 0],
      color: '#444',
      table: {
        widths: [112, 150, 80, 140],
        headerRows: 1,
        body: [
          [
            {
              text: 'Diagnosis',
              style: 'tableSubHeader',
              colSpan: 4,
              alignment: 'left'
            },{},{},{}
          ],
          components.diagnosis.render(data),
          [
            {
              text: 'Apakah pasien dirawat di rumah sakit' + `: [${isLocationTrue('RS')}] Ya   [${isLocationFalse('RS')}] Tdk`,
              colSpan: 4,
              alignment: 'left'
            },{},{},{}
          ],
          components.treatment.render(data),
          [
            {
              text: 'Jika ada, nama-nama RS sebelumnya : ...\n.',
              colSpan: 4,
              alignment: 'left'
            },{},{},{}
          ],
          [
            {
              text:
                `Status pasien terakhir : ${patientStatuses(data.final_result)} , `
                + `Tanggal: ${formattedDate(data.last_date_status_patient)}`,
              colSpan: 4,
              alignment: 'left'
            },{},{},{}
          ]
        ],
      }
    },
  ]
}

module.exports = {
  render
}