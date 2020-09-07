const render = (data) => {

  const isTrue = (value) => {
    return data.last_history[value] ? '√' : '  '
  }
  
  const isFalse = (value) => {
    return !data.last_history[value] ? '√' : '  '
  }

  const market = data.close_contact_animal_market
  const faskes = data.close_contact_medical_facility
  const isVisited = (value, n) => {
    return value == n ? '√' : '  '
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

  const buildResidences = () => {
    let residences = [], residencesDoc = []
    if (!residences.length) {
      for (let i = 0;  i < 2; i++) {
        residencesDoc.push([
          { text: '-', colSpan: 2 },{},
          { text: '-', colSpan: 2 },{},
      ])
      }
    }

    return residencesDoc
  }

  const buildSuspectContact = () => {
    let suspects = [], suspectsDoc = []
    if (!suspects.length) {
      for (let i = 0;  i < 2; i++) {
        suspectsDoc.push([
          { text: '-' },
          { text: '-' },
          { text: '-' },
          { text: '-' },
          { text: '-' }
      ])
      }
    }

    return suspectsDoc
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
              text: 'D FAKTOR RIWAYAT PERJALANAN',
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
            { text: 'Tgl tiba di tempat', style: 'tableColumnSubHeader'  },
          ],
          ...buildVisitedPlaces('visited_city'),
          [
            {
              border: ['black', 'black','','black'],
              text: 'Dalam 14 hari sebelum sakit, apakah memiliki riwayat tinggal ke area transmisi lokal?',
              colSpan: 2,
              alignment: 'left'
            },
            {},
            {
              border: ['', 'black','black','black'],
              text: `: [${isVisited(market, 1)}] Ya   [${isVisited(market, 2)}] Tdk  [${isVisited(market, 3)}] Tdk Tahu`,
              colSpan: 2,
              alignment: 'left'
            },{}
          ],
          [
            { text: 'Provinsi', colSpan: 2, style: 'tableColumnSubHeader' },
            {},
            { text: 'Kota', colSpan: 2, style: 'tableColumnSubHeader'  },
            {},
          ],
          ...buildResidences()
        ],
      }
    },
    {
      margin: [0, -15, 0, 0],
      style: 'tableClinical',
      color: '#444',
      table: {
        widths: [105, 157, 81, 65, 65],
        headerRows: 1,
        body: [
          [
            {
              border: ['black', 'black','','black'],
              text: 'Dalam 14 hari sebelum sakit, apakah memiliki kontak dengan kasus suspek/probable COVID-19 ?',
              colSpan: 2,
              alignment: 'left'
            },
            {},
            {
              border: ['', 'black','black','black'],
              text: `: [${isVisited(faskes, 1)}] Ya   [${isVisited(faskes, 2)}] Tdk  [${isVisited(faskes, 3)}] Tdk Tahu`,
              text: '',
              text: `: [${suspectContact([CRITERIA.SUS, CRITERIA.PROB]) ? '√' : '  ' }] Ya   [${!suspectContact([CRITERIA.SUS, CRITERIA.PROB]) ? '√' : '  ' }] Tdk  [  ] Tdk Tahu`,
              colSpan: 3,
              alignment: 'left'
            },{},{}
          ],
          [
            { text: 'Nama', style: 'tableColumnSubHeader' },
            { text: 'Alamat', style: 'tableColumnSubHeader'  },
            { text: 'Hubungan', style: 'tableColumnSubHeader'  },
            { text: 'Tgl Kontak Pertama', style: 'tableColumnSubHeader'  },
            { text: 'Tgl Kontak Terakhir', style: 'tableColumnSubHeader'  },
          ],
          ...buildSuspectContact(),
        ]
      }
    }
  ]
}

module.exports = {
  render
}