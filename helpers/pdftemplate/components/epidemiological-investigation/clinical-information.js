const moment = require('moment')
const {
  patientStatus,
} = require('../../../custom')
const components = {
  symptoms: require('./symptoms'),
  diseases: require('./diseases'),
  treatment: require('./treatment'),
  diagnosis: require('./diagnosis'),
}

const formattedDate = (d) => {
  return d ? moment(d).format('YYYY/MM/DD') : '-'
}

const isLocationTrue = (data, value) => {
  return  data.last_history.current_location_type === value ? '√' : '  '
}

const isLocationFalse = (data, value) => {
  return  data.last_history.current_location_type !== value ? '√' : '  '
}

const render = (data) => {

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
              text: 'Apakah pasien dirawat di rumah sakit' + `: [${isLocationTrue(data, 'RS')}] Ya   [${isLocationFalse(data, 'RS')}] Tdk`,
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
                `Status pasien terakhir : ${patientStatus(data.final_result)} , `+
                `Tanggal: ${formattedDate(data.last_date_status_patient)}`,
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