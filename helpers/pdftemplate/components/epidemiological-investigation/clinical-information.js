const components = {
  symptoms: require('./symptoms')
}

const render = (data) => {
  
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
        components.symptoms.render(data)
      ],
    }
  }
}

module.exports = {
  render
}