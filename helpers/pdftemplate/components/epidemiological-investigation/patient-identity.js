const moment = require('moment')
const render = (data) => {
  const ageInMonths = moment().diff(data.birth_date, 'months') || 0
  return {
      style: 'tableExample',
      color: '#444',
      table: {
        widths: [112, 150, 80, 140],
        headerRows: 1,
        // keepWithHeaderRows: 1,
        body: [
          [
            {
              text: 'A. IDENTITAS PASIEN',
              style: 'tableHeader',
              colSpan: 4,
              alignment: 'left',
            },
            {},
            {},
            'Pasien Dalam Pengawasan'
          ],
          [
            {
              text: 'Nama Pasien',
              borderColor: ['black', 'black', 'white', 'black']
            },
            {
              text: `: ${data.name}`,
              borderColor: ['white', 'black', 'black', 'black']
            },
            {
              rowSpan: 3,
              text: 'Kriteria* :',
              borderColor: ['black', 'black', 'white', 'black']
            },
            {
              rowSpan: 3,
              text: `${data.status === 'PDP' ? '[√]' : '[  ]'} Pasien dalam pengawasan
                ${data.status === 'ODP' ? '[√]' : '[  ]'} Orang Dalam Pemantauan
                [  ] Kasus Probabel
                [  ] Kasus Konfirmasi`,
            }
          ],
          [
            {
              text: 'Nomor ID',
              borderColor: ['black', 'black', 'white', 'black']
            },
            {
              text: `: ${data.id_case.toUpperCase()}`,
              borderColor: ['white', 'black', 'black', 'black']
            },
            '',''
          ],
          [
            {
              text: 'Nama Orang tua/KK',
              borderColor: ['black', 'black', 'white', 'black']
            },
            {
              text: ': -',
              borderColor: ['white', 'black', 'black', 'black']
            },
            '',''
          ],
          [
            { text: `Tgl lahir: ${data.birth_date ? moment(data.birth_date).format('YYYY/MM/DD') : '-' }` },
            { text: `Umur: ${data.age || 0 } tahun, ${ageInMonths < 12 ? ageInMonths : ageInMonths%12 } bulan` },
            { text: `${data.gender === 'L' ? '[√]' : '[  ]'} Laki-laki
              ${data.gender === 'P' ? '[√]' : '[  ]'} Perempuan` },
            { text: 'Pekerjaan: ' + (data.occupation || '-') },
          ],
          [
            { text: `Alamat Jalan/Blok`, borderColor: ['black', 'black', 'white', 'white']},
            { text: `: ${data.address_street || '-' }`, borderColor: ['white', 'black', 'white', 'white'] },
            { text: `Kecamatan`, borderColor: ['white', 'black', 'white', 'white'] },
            { text: `: ${data.address_subdistrict_name}` },
          ],
          [
            { text: `\t\t\t RT/RW`, borderColor: ['black', 'white', 'white', 'white'] },
            { text: `: -/-`, borderColor: ['black', 'white', 'white', 'white'] },
            { text: `Kabupaten/Kota`, borderColor: ['black', 'white', 'white', 'white'] },
            { text: `: ${data.address_district_name}`, borderColor: ['black', 'white', 'black', 'white'] },
          ],
          [
            { text: `\t\t Desa/Kelurahan`, borderColor: ['black', 'white', 'white', 'black'] },
            { text: `: ${data.address_village_name}`, borderColor: ['black', 'white', 'white', 'black'] },
            { text: `Telepon/Hp`, borderColor: ['black', 'white', 'white', 'black'] },
            { text: `: ${data.phone_number || '-' }`, borderColor: ['black', 'white', 'black', 'black'] },
          ],
        ],
      },
  }
}

module.exports = {
  render
}