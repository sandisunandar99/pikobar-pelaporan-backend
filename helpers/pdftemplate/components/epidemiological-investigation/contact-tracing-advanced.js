const {
  CRITERIA
} = require('../../../constant')

const moment = require('moment')

const isTrue = (value) => {
  return value ? '√' : '  '
}

const isFalse = (value) => {
  return !value ? '√' : '  '
}

const formattedDate = (d) => {
  return d ? moment(d).format('YYYY/MM/DD') : '-'
}

const confirmedContact = (data, criterias) => {
  let res = false
  let records = data
  if (!records) {
    return false
  }

  records = records.closeContacts
  if (!records || !records.length) {
    return false
  }

  records.forEach(v => {
    if (criterias.includes(v.status)) {
      res = true
    }
  })

  return res
}

const buildConfirmedContact = (data, criterias) => {
  let res = []

  let records = []
  if (data && data.closeContacts) {
    records = data.closeContacts
  }

  for (i in records) {
    const rec = records[i]
    if (!criterias.includes(rec.status)) continue

    res.push([
        { alignment: 'left', text: rec.name || '-' },
        { alignment: 'left', text: rec.address_street || '-' },
        { alignment: 'center', text: rec.close_contact_relation || '-' },
        { alignment: 'center', text: formattedDate(rec.first_contact_date) },
        { alignment: 'center', text: formattedDate(rec.last_contact_date) },
    ])
  }

  if (!res.length) {
    res.push([
      { alignment: 'center', text: '- Tidak ada riwayat -', colSpan: 5 },{},{},{},{},
    ])
  }

  return res
}

const compConfirmedContact = data => {
  return [
    [
      {
        text: 'D FAKTOR KONTAK/PAPARAN (lanjutan)',
        style: 'tableHeader',
        colSpan: 5,
        alignment: 'left'
      },{},{},{},{}
    ],
    [
      {
        // border: ['black', '','','black'],
        text: 'Dalam 14 hari sebelum sakit, apakah memiliki kontak erat dengan kasus konfirmasi dan probable COVID-19?',
        colSpan: 2,
        alignment: 'left'
      },
      {},
      {
        // border: ['', '','black','black'],
        text: `: [${confirmedContact(data, [CRITERIA.CONF]) ? '√' : '  ' }] Ya   [${!confirmedContact(data, [CRITERIA.CONF]) ? '√' : '  ' }] Tdk  [  ] Tdk Tahu`,
        colSpan: 3,
        alignment: 'left'
      },{},{}
    ],
    [
      { text: 'Nama', style: 'tableColumnSubHeader' },
      { text: 'Alamat', style: 'tableColumnSubHeader'  },
      { text: 'Hubungan', style: 'tableColumnSubHeader'  },
      { text: 'Tgl kontak pertama', style: 'tableColumnSubHeader'  },
      { text: 'Tgl kontak terakhir', style: 'tableColumnSubHeader'  },
    ],
    ...buildConfirmedContact(data, [CRITERIA.CONF]),
  ]
}

const compIspaGroup = data => {
  const ispaGroup = data.close_contact_heavy_ispa_group
  return [
    [
      {
        text: 'Apakah pasien termasuk cluster ISPA berat (demam dan  pneumonia membutuhkan perawatan Rumah Sakit) yang tidak diketahui peyebabnya dimana kasus COVID-19 diperiksa?',
        colSpan: 2,
        alignment: 'left'
      },
      {},
      {
        text: `: [${isTrue(ispaGroup)}] Ya   [${isFalse(ispaGroup)}] Tdk  [  ] Tdk Tahu`,
        colSpan: 3,
        alignment: 'left'
      },{},{}
    ],
  ]
}

const compHealthWorker = data => {
  const officer = data.close_contact_health_worker
  const protectionTools = data.apd_use ? data.apd_use.map(v => v.toLowerCase()) : []

  const isProtected = (value) => {
    return protectionTools.includes(value) ? '√' : '  '
  }
  return [
    [
      {
        text: 'Apakah pasien seorang petugas kesehatan?',
        colSpan: 2,
        alignment: 'left'
      },
      {},
      {
        text: `: [${isTrue(officer)}] Ya   [${isFalse(officer)}] Tdk  [  ] Tdk Tahu`,
        colSpan: 3,
        alignment: 'left'
      },{},{}
    ],
    [
      {
        text: 'Jika iya Palat pelindung diri (APD) apa yang digunakan?',
        colSpan: 2,
        alignment: 'left'
      },
      {},
      {
        text: `: [${isProtected('gown')}] Gown   [${isProtected('masker bedah')}] Masker Medis   [${isProtected('sarung tangan')}] Sarung tangan
          : [${isProtected('masker n95 standar ffp3')}] Masker NI0SH-N95, AN EU STANDARD FFP2
          : [${isProtected('ffp3')}] FFP3
          : [${isProtected('kacamata pelindung goggle')}] Kacamata pelindung (goggle)
          : [${isProtected('tidak sama sekali')}] Tidak memakai APD`,
        colSpan: 3,
        alignment: 'left'
      },{},{}
    ],
  ]
}

const compAerosolProcedure = data => {
  const aerosol = data.close_contact_performing_aerosol_procedures
  const aerosolSubject = data.close_contact_performing_aerosol
  return [
    [
      {
        text: 'Apakah melakukan prosedur yang menimbulkan aerosol?',
        colSpan: 2,
        alignment: 'left'
      },
      {},
      {
        text: `: [${isTrue(aerosol)}] Ya   [${isFalse(aerosol)}] Tdk, Sebutkan: ${aerosolSubject || '-'}`,
        colSpan: 3,
        alignment: 'left'
      },{},{}
    ],
    [
      {
        text: 'Lain-lain, sebutkan\n.\n.',
        colSpan: 5,
        alignment: 'left'
      },
      {},{},{}
    ]
  ]
}
const render = (data) => {
  return [
    {
      // margin: [0, -15, 0, 0],
      style: 'tableClinical',
      color: '#444',
      pageBreak: 'before',
      table: {
        widths: [105, 157, 81, 65, 65],
        headerRows: 1,
        body: [
          ...compConfirmedContact(data),
          ...compIspaGroup(data),
          ...compHealthWorker(data),
          ...compAerosolProcedure(data),
        ],
      }
    },
  ]
}

module.exports = {
  render
}
