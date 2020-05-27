const render = (data) => {

  const isTrue = (value) => {
    return data.last_history[value] ? '√' : '  '
  }
  
  const isFalse = (value) => {
    return !data.last_history[value] ? '√' : '  '
  }

  const buildVisitedPlaces = (place) => {
    let visitedPlaces = [], visitedPlacesDoc = []
    for (i in data.histories) {
      const visitedPlace = data.histories[i][place]
      if (visitedPlaces.includes(visitedPlace) || !visitedPlace) continue

      visitedPlaces.push(visitedPlace)
      visitedPlacesDoc.push([
          { text: visitedPlace },
          { text: '-' },
          { text: '-' },
          { text: '-' },
      ])
    }

    if (!visitedPlaces.length) {
      for (let i = 0;  i < 2; i++) {
        visitedPlacesDoc.push([
          { text: '-' },
          { text: '-' },
          { text: '-' },
          { text: '-' },
      ])
      }
    }

    return visitedPlacesDoc
  }

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
              text: `: [${isTrue('is_went_abroad')}] Ya   [${isFalse('is_went_abroad')}] Tdk  [  ] Tdk Tahu`,
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
          ...buildVisitedPlaces('visited_country'),
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
              text: `: [${isTrue('is_went_other_city')}] Ya   [${isFalse('is_went_other_city')}] Tdk  [  ] Tdk Tahu`,
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
          ...buildVisitedPlaces('visited_city'),
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
          ...buildVisitedPlaces('visited_hospital'),
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
          ...buildVisitedPlaces('visited_market'),
        ],
      }
    },
  ]
}

module.exports = {
  render
}