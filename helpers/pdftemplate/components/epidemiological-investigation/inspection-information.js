const components = {
  diseases: require('./diseases'),
}

const render = (data) => {
  
  return [
    {
      style: 'tableClinical',
      color: '#444',
      table: {
        widths: [15, 125, 100, 100, 132],
        headerRows: 1,
        body: [
          [
            {
              text: 'C INFORMASI PEMERIKSAAN PENUNJANG',
              style: 'tableHeader',
              colSpan: 5,
              alignment: 'left'
            },{},{},{},{}
          ],
          [
            { text: 'No', style: 'tableColumnSubHeader' },
            { text: 'Jenis Pemeriksaan/Spesimen', style: 'tableColumnSubHeader'  },
            { text: 'Tanggal Pengambilan Spesimen', style: 'tableColumnSubHeader'  },
            { text: 'Tempat Pemeriksaan', style: 'tableColumnSubHeader'  },
            { text: 'Hasil', style: 'tableColumnSubHeader'  },
          ],
          [
            {
              text: 'Laboratorium konfirmasi',
              bold: true,
              colSpan: 5,
              alignment: 'left'
            },{},{},{},{}
          ],
          [
            { text: '1.' },
            { text: 'Nasopharyngeal (NP) Swab'},
            { text: ''},
            { text: ''},
            { text: ''},
          ],
          [
            { text: '2.' },
            { text: 'Oropharyngeal (NP) Swab'},
            { text: ''},
            { text: ''},
            { text: ''},
          ],
          [
            { text: '3.' },
            { text: 'Sputum'},
            { text: ''},
            { text: ''},
            { text: ''},
          ],
          [
            { text: '4.' },
            { text: 'Serum'},
            { text: ''},
            { text: ''},
            { text: ''},
          ],
          [
            {
              text: 'Pemeriksaan lain',
              bold: true,
              colSpan: 5,
              alignment: 'left'
            },{},{},{},{}
          ],
          [
            { text: '1.' },
            { text: 'Darah'},
            { text: ''},
            { text: ''},
            { text: ''},
          ],
          [
            { text: '2.' },
            { text: 'Serum'},
            { text: ''},
            { text: ''},
            { text: ''},
          ],
          [
            { text: '3.' },
            { text: 'Lain, Sebutkan\n.'},
            { text: ''},
            { text: ''},
            { text: ''},
          ],
        ],
      }
    },
  ]
}

module.exports = {
  render
}