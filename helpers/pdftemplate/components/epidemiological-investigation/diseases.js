
const moment = require('moment')
const render = (data) => {
  
  const diseases = data.last_history.diseases.map(s => s.toLowerCase())

  const isTrue = (value) => {
    return diseases.includes(value) ? '√' : '  '
  }

  const isFalse = (value) => {
    return !diseases.includes(value) ? '√' : '  '
  }

  return [
    {
      colSpan: 4,
      table: {
        widths: [112, 135, 110, 125],
        body: [
          [
            { text: `Hamil`, border: [] },
            { text: `: [${isTrue('hamil')}] Ya   [${isFalse('hamil')}] Tdk`, border: [] },
            { text: `Gannguan imunologi`, border: [] },
            { text: `: [${isTrue('gannguan imunologi')}] Ya   [${isFalse('gannguan imunologi')}] Tdk`, border: [] },
          ],
          [
            { text: `Diabetes`, border: [] },
            { text: `: [${isTrue('diabetes')}] Ya   [${isFalse('diabetes')}] Tdk`, border: [] },
            { text: `Gagal ginjal kronis`, border: [] },
            { text: `: [${isTrue('gagal ginjal kronis')}] Ya   [${isFalse('gagal ginjal kronis')}] Tdk`, border: [] },
          ],
          [
            { text: `Penyakit jantung`, border: [] },
            { text: `: [${isTrue('penyakit jantung')}] Ya   [${isFalse('penyakit jantung')}] Tdk`, border: [] },
            { text: `Gagal hati kronis`, border: [] },
            { text: `: [${isTrue('gagal hati kronis')}] Ya   [${isFalse('gagal hati kronis')}] Tdk`, border: [] },
          ],
          [
            { text: `Hipertensi`, border: [] },
            { text: `: [${isTrue('hipertensi')}] Ya   [${isFalse('hipertensi')}] Tdk`, border: [] },
            { text: `PPOK`, border: [] },
            { text: `: [${isTrue('ppok')}] Ya   [${isFalse('ppok')}] Tdk`, border: [] },
          ],
          [
            { text: `Keganasan`, border: [] },
            { text: `: [${isTrue('keganasan')}] Ya   [${isFalse('keganasan')}] Tdk`, border: [] },
            { text: `Lainnya (sebutkan)`, border: [] },
            { text: `: ${data.last_history.diseases_other || '-'}`, border: [] },
          ],
        ],
      },
      layout: {
        paddingLeft: (i, node) => 0,
        paddingTop: (i, node) => -0.2,
        paddingBottom: (i, node) => 0
      }
      // 
    },{},{},{}
  ]
}

module.exports = {
  render
}