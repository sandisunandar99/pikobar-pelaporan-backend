const layout = require('../../layouts/epidemiological-investigation')
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

  const isFinalResult = (value) => {
    if (!value) return '  '
    if (data.last_history.stage === "1")
      return data.last_history.final_result === value ? '√' : '  '
    else
      return '  '
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
          components.symptoms.render(data),
          [
            {
              text: 'Kondisi Penyerta',
              style: 'tableSubHeader',
              colSpan: 4,
              alignment: 'left'
            },{},{},{}
          ],
          components.diseases.render(data),
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
              text: `Status pasien terakhir : [${isFinalResult("1")}] Sembuh    [${isFinalResult(null)}] Masih Sakit   [${isFinalResult("2")}] Meninggal, tgl: -`,
              colSpan: 4,
              alignment: 'left'
            },{},{},{}
          ],
        ],
      }
    },
    layout.footnoteSectionOne,
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
        ],
      }
    },
  ]
}

module.exports = {
  render
}