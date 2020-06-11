const components = {
  diseases: require('./diseases'),
}

const render = (data) => {
  
  return [
    {
      style: 'tableClinical',
      color: '#444',
      table: {
        widths: [105, 25, 17, 70, 85, 70, 83],
        headerRows: 1,
        body: [
          [
            {
              text: 'E. DAFTAR KONTAK ERAT KASUS',
              style: 'tableHeader',
              colSpan: 7,
              alignment: 'left'
            },{},{},{},{},{},{}
          ],
          [
            { text: 'Nama', style: 'tableColumnSubHeader' },
            { text: 'Umur', style: 'tableColumnSubHeader'  },
            { text: 'JK', style: 'tableColumnSubHeader'  },
            { text: 'Hub. dg Kasus', style: 'tableColumnSubHeader'  },
            { text: 'Alamat rumah', style: 'tableColumnSubHeader'  },
            { text: 'No HP/telp yang dapat dihubungi', style: 'tableColumnSubHeader'  },
            { text: 'Aktifitas kontak yang dilakukan', style: 'tableColumnSubHeader'  },
          ],
          [
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
          ],
          [
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
          ],
          [
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
          ],
          [
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
            { text: '-'},
          ],
        ],
      }
    },
  ]
}

module.exports = {
  render
}