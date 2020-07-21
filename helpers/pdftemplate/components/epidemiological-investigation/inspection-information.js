const components = {
  diseases: require('./diseases'),
}

const render = (data) => {
  
  return [
    {
      pageBreak: 'before',
      style: 'tableClinical',
      color: '#444',
      table: {
        widths: [13, 70, 78, 78, 25, 78, 78, 25],
        headerRows: 1,
        body: [
          [
            {
              text: 'C INFORMASI PEMERIKSAAN PENUNJANG',
              style: 'tableHeader',
              colSpan: 8,
              alignment: 'left'
            },{},{},{},{},{},{},{}
          ],
          [
            { text: 'No', style: 'tableColumnSubHeader' },
            { text: 'Jenis Pemeriksaan/Spesimen', style: 'tableColumnSubHeader' },
            { text: 'Pengambilan Spesimen 1', style: 'tableColumnSubHeader', colSpan: 3  },{},{},
            { text: 'Pengambilan Spesimen 2', style: 'tableColumnSubHeader', colSpan: 3  },{},{},
          ],
          [
            { text: '', style: 'tableColumnSubHeader' },
            { text: '', style: 'tableColumnSubHeader'  },
            { text: 'Tanggal Pengambilan', style: 'tableColumnSubHeader'  },
            { text: 'Tempat Pemeriksaan', style: 'tableColumnSubHeader'  },
            { text: 'Hasil', style: 'tableColumnSubHeader'  },
            { text: 'Tanggal Pengambilan', style: 'tableColumnSubHeader'  },
            { text: 'Tempat Pemeriksaan', style: 'tableColumnSubHeader'  },
            { text: 'Hasil', style: 'tableColumnSubHeader'  }
          ],
          [
            {
              text: 'Laboratorium konfirmasi',
              bold: true,
              colSpan: 8,
              alignment: 'left'
            },{},{},{},{},{},{},{}
          ],
          [
            { text: '1.' },
            { text: 'Nasopharyngeal (NP) Swab'},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''}
          ],
          [
            { text: '2.' },
            { text: 'Oropharyngeal (NP) Swab'},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''}
          ],
          [
            { text: '3.' },
            { text: 'Sputum'},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''}
          ],
          [
            { text: '4.' },
            { text: 'Serum'},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''}
          ],
          [
            {
              text: 'Pemeriksaan lain',
              bold: true,
              colSpan: 8,
              alignment: 'left'
            },{},{},{},{},{},{},{}
          ],
          [
            { text: '1.' },
            { text: 'Darah'},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''}
          ],
          [
            { text: '2.' },
            { text: 'Serum'},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''}
          ],
          [
            { text: '3.' },
            { text: 'Lain, Sebutkan\n.'},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''},
            { text: ''}
          ],
        ],
      }
    },
  ]
}

module.exports = {
  render
}