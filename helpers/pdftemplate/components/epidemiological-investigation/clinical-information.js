const components = {
  symptoms: require('./symptoms'),
  diseases: require('./diseases'),
  treatment: require('./treatment')
}

const render = (data) => {
  const isLocationTrue = (value) => {
    return  data.last_history.current_location_type === value ? '√' : '  '
  }

  const isLocationFalse = (value) => {
    return  data.last_history.current_location_type !== value ? '√' : '  '
  }
  
  return {
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
            text: 'Status pasien terakhir : [  ] Sembuh    [  ] Masih Sakit   [  ] Meninggal, tgl: ...',
            colSpan: 4,
            alignment: 'left'
          },{},{},{}
        ],
      ],
    }
  }
}

module.exports = {
  render
}