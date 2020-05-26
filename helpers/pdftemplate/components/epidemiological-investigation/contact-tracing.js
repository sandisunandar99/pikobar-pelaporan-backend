const components = {
  diseases: require('./diseases'),
}

const render = (data) => {
  
  return [
    {
      style: 'tableClinical',
      color: '#444',
      table: {
        widths: [145, 115, 110, 112],
        headerRows: 1,
        body: [
          [
            {
              text: 'D FAKTOR KONTAK/PAPARAN',
              style: 'tableHeader',
              colSpan: 4,
              alignment: 'left'
            },{},{},{}
          ],
          [
            {
              border: ['black', 'black','','black'],
              text: 'Dalam 14 hari sebelum sakit, apakah memiliki riwayat Perjalanan ke luar negeri?',
              colSpan: 2,
              alignment: 'left'
            },
            {},
            {
              border: ['', 'black','black','black'],
              text: ': [  ] Ya   [  ] Tdk  [  ] Tdk Tahu',
              colSpan: 2,
              alignment: 'left'
            },{}
          ],
          [
            { text: 'Negara', style: 'tableColumnSubHeader' },
            { text: 'Kota', style: 'tableColumnSubHeader'  },
            { text: 'Tgl Perjalanan', style: 'tableColumnSubHeader'  },
            { text: 'Tgl tiba di Indonesia', style: 'tableColumnSubHeader'  },
          ],
          [
            { text: '-' },
            { text: '-' },
            { text: '-' },
            { text: '-' },
          ],
          [
            { text: '-' },
            { text: '-' },
            { text: '-' },
            { text: '-' },
          ],
          [
            {
              border: ['black', 'black','','black'],
              text: 'Dalam 14 hari sebelum sakit, apakah memiliki riwayat Perjalanan ke area transmisi lokal?',
              colSpan: 2,
              alignment: 'left'
            },
            {},
            {
              border: ['', 'black','black','black'],
              text: ': [  ] Ya   [  ] Tdk  [  ] Tdk Tahu',
              colSpan: 2,
              alignment: 'left'
            },{}
          ],
          [
            { text: 'Provinsi', style: 'tableColumnSubHeader' },
            { text: 'Kota', style: 'tableColumnSubHeader'  },
            { text: 'Tgl Perjalanan', style: 'tableColumnSubHeader'  },
            { text: 'Tgl tiba di tempat sekarang', style: 'tableColumnSubHeader'  },
          ],
          [
            { text: '-' },
            { text: '-' },
            { text: '-' },
            { text: '-' },
          ],
          [
            { text: '-' },
            { text: '-' },
            { text: '-' },
            { text: '-' },
          ],
          [
            {
              border: ['black', 'black','','black'],
              text: 'Dalam 14 hari sebelum sakit, apakah memiliki riwayat berkunjung ke fasilitas kesehatan, baik sebagai pasien, pekerja, atau berkunjung?',
              colSpan: 2,
              alignment: 'left'
            },
            {},
            {
              border: ['', 'black','black','black'],
              text: ': [  ] Ya   [  ] Tdk  [  ] Tdk Tahu',
              colSpan: 2,
              alignment: 'left'
            },{}
          ],
          [
            { text: 'Nama RS', style: 'tableColumnSubHeader' },
            { text: 'Kota', style: 'tableColumnSubHeader'  },
            { text: 'Provinsi/Negara', style: 'tableColumnSubHeader'  },
            { text: 'Tgl Kunjungan', style: 'tableColumnSubHeader'  },
          ],
          [
            { text: '-' },
            { text: '-' },
            { text: '-' },
            { text: '-' },
          ],
          [
            { text: '-' },
            { text: '-' },
            { text: '-' },
            { text: '-' },
          ],
          [
            {
              border: ['black', 'black','','black'],
              text: 'Dalam 14 hari sebelum sakit, mengunjungi pasar hewan?',
              colSpan: 2,
              alignment: 'left'
            },
            {},
            {
              border: ['', 'black','black','black'],
              text: ': [  ] Ya   [  ] Tdk  [  ] Tdk Tahu',
              colSpan: 2,
              alignment: 'left'
            },{}
          ],
          [
            { text: 'Nama Lokasi', style: 'tableColumnSubHeader' },
            { text: 'Kota', style: 'tableColumnSubHeader'  },
            { text: 'Provinsi/Negara', style: 'tableColumnSubHeader'  },
            { text: 'Tgl Kunjungan', style: 'tableColumnSubHeader'  },
          ],
          [
            { text: '-' },
            { text: '-' },
            { text: '-' },
            { text: '-' },
          ],
          [
            { text: '-' },
            { text: '-' },
            { text: '-' },
            { text: '-' },
          ],
        ],
      }
    },
  ]
}

module.exports = {
  render
}