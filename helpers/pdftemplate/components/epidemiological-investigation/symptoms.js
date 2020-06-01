
const moment = require('moment')
const render = (data) => {
  
  const symptoms = data.last_history.diagnosis.map(s => s.toLowerCase())

  const isTrue = (value) => {
    return symptoms.includes(value) ? '√' : '  '
  }

  const isFalse = (value) => {
    return !symptoms.includes(value) ? '√' : '  '
  }

  const isFever = () => {
    return symptoms.includes('suhu tubuh >= 38 °c')
  }

  return [
    {
      colSpan: 4,
      table: {
        widths: [112, 135, 110, 125],
        body: [
          [
            { text: `Tanggal pertama kali timbul gejala (onset)`, border: [] },
            { text: `: ${moment(data.last_history.first_symptom_date).format('YYYY/MM/DD')}`, border: [] },
            { text: ``, border: [] },
            { text: ``, border: [] },
          ],
          [
            { text: `Demam`, border: [] },
            { text: `: ${isFever() ? '≥38' : '___' } °C [${isFever() ? '√' : '  '}] Riwayat Demam `, border: [] },
            { text: `Lemah (malaise)`, border: [] },
            { text: `: [${isTrue('lemah (malaise)')}] Ya   [${isFalse('lemah (malaise)')}] Tdk  [  ] Tdk tahu `, border: [] },
          ],
          [
            { text: `Batuk`, border: [] },
            { text: `: [${isTrue('batuk')}] Ya   [${isFalse('batuk')}] Tdk  [  ] Tdk tahu `, border: [] },
            { text: `Nyeri Otot`, border: [] },
            { text: `: [${isTrue('nyeri otot')}] Ya   [${isFalse('nyeri otot')}] Tdk  [  ] Tdk tahu `, border: [] },
          ],
          [
            { text: `Pilek`, border: [] },
            { text: `: [${isTrue('pilek')}] Ya   [${isFalse('pilek')}] Tdk  [  ] Tdk tahu `, border: [] },
            { text: `Mual atau muntah`, border: [] },
            { text: `: [${isTrue('mual atau muntah')}] Ya   [${isFalse('mual atau muntah')}] Tdk  [  ] Tdk tahu `, border: [] },
          ],
          [
            { text: `Sakit tenggorokan`, border: [] },
            { text: `: [${isTrue('sakit tenggorokan')}] Ya   [${isFalse('sakit tenggorokan')}] Tdk  [  ] Tdk tahu `, border: [] },
            { text: `Nyeri abdomen`, border: [] },
            { text: `: [${isTrue('nyeri abdomen')}] Ya   [${isFalse('nyeri abdomen')}] Tdk  [  ] Tdk tahu `, border: [] },
          ],
          [
            { text: `Sesak napas`, border: [] },
            { text: `: [${isTrue('sesak napas')}] Ya   [${isFalse('sesak napas')}] Tdk  [  ] Tdk tahu `, border: [] },
            { text: `Diare`, border: [] },
            { text: `: [${isTrue('diare')}] Ya   [${isFalse('diare')}] Tdk  [  ] Tdk tahu `, border: [] },
          ],
          [
            { text: `Sakit Kepala`, border: [] },
            { text: `: [${isTrue('sakit kepala')}] Ya   [${isFalse('sakit kepala')}] Tdk  [  ] Tdk tahu `, border: [] },
            { text: `Lainnya (sebutkan)`, border: [] },
            { text: `: ${data.last_history.diagnosis_other}`, border: [] },
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