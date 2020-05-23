const layout = {
    header: [
        {
            text: 'FORMULIR PENYELIDIKAN EPIDIOMOLOGI',
            style: 'header'
        },
        {
            text: 'CORONAVIRUS DISEASE (COVID-19)',
            style: 'header'
        }
    ],
    subheader: [
        {
            style: 'subheader',
            text: 'Nama Fasyankes : '
        },
        {
            columns: [
                { text: 'Nama Pewawancara : ' },
                { text: 'Tanggal Wawancara : '}
            ]
        },
        {
            columns: [
                { text: 'Tempat Tugas : '},
                { text: 'HP Pewawancara : '}
            ]
        }
    ],
    styles: {
        header: {
          fontSize: 13,
          bold: true,
          alignment: 'center'
        },
        subheader: {
          margin: [0, 10, 0, 0],
        },
        tableExample: {
          margin: [0, 5, 0, 0]
        },
        tableClinical: {
          margin: [0, 0, 0, 15]
        },
        tableOpacityExample: {
          margin: [0, 5, 0, 15],
          fillColor: 'blue',
          fillOpacity: 0.3
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          fillColor: '#e6e6e6'
        },
        tableSubHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        }
      },
      defaultStyle: {
        fontSize: 10
        // alignment: 'justify'
      }
}

module.exports = layout