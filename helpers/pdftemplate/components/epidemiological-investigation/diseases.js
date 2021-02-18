
const isTrue = (value, diseases) => {
  return diseases.includes(value) ? '√' : '  '
}

const isFalse = (value, diseases) => {
  return !diseases.includes(value) ? '√' : '  '
}

const sameBorder = (textHeader, diseases) => {
  return `: [${isTrue(textHeader.toLowerCase(), diseases)}] Ya   [${isFalse(textHeader.toLowerCase(), diseases)}] Tdk`
}

const tdBody = (textHeader, textBorder, diseases) => {
  return [
    { text: `${textHeader}`, border: [] },
    { text:  sameBorder(textHeader, diseases), border: [] },
    { text: `${textBorder}`, border: [] },
    { text: `: [${isTrue(textBorder.toLowerCase(), diseases)}] Ya   [${isFalse(textBorder.toLowerCase(), diseases)}] Tdk`, border: [] },
  ]
}

const render = (data) => {
  const diseases = data.last_history.diseases.map(s => s.toLowerCase())
  return [
    {
      colSpan: 4,
      table: {
        widths: [112, 135, 110, 125],
        body: [
          tdBody('Hamil', 'Gangguan imunologi', diseases),
          tdBody('Diabetes', 'Gagal ginjal kronis', diseases),
          tdBody('Penyakit jantung', 'Gagal hati kronis', diseases),
          tdBody('Hipertensi', 'PPOK', diseases),
          [
            { text: `Keganasan`, border: [] },
            { text: `: [${isTrue('keganasan', diseases)}] Ya   [${isFalse('keganasan', diseases)}] Tdk`, border: [] },
            { text: `Lainnya (sebutkan)`, border: [] },
            { text: `: ${data.last_history.diseases_other || '-'}`, border: [] },
          ],
        ],
      },
      layout: {
        paddingLeft: (i, node) => 0, paddingTop: (i, node) => -0.2,
        paddingBottom: (i, node) => 0
      }
    },{},{},{}
  ]
}

module.exports = {
  render
}