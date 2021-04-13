
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

  const firstSymptomDate = data.last_history.first_symptom_date
  const dateSymptom = firstSymptomDate ? moment(firstSymptomDate).format('YYYY/MM/DD') : "-"

  return [
    [
      { text: `Tanggal pertama kali timbul gejala (onset)`, /* border: [] */ },
      { text: `: ${dateSymptom}`, /* border: [] */ },
      { text: ``, /* border: [] */ },
      { text: ``, /* border: [] */ },
    ],
    [
      { text: `Demam`, borderColor: ['black', 'black', 'white', 'black'] },
      { text: `: ${isFever() ? '≥38' : '___' } °C [${isFever() ? '√' : '  '}] Riwayat Demam `, /* border: [] */ },
      { text: `Lemah (malaise)`, borderColor: ['black', 'white', 'black', 'white'] },
      { text: `: [${isTrue('lemah (malaise)')}] Ya   [${isFalse('lemah (malaise)')}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'white', 'black', 'white'] },
    ],
    [
      { text: `Batuk`, borderColor: ['black', 'white', 'black', 'white']  },
      { text: `: [${isTrue('batuk')}] Ya   [${isFalse('batuk')}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'black', 'black', 'white'] },
      { text: `Nyeri Otot`, borderColor: ['black', 'white', 'black', 'white'] },
      { text: `: [${isTrue('nyeri otot')}] Ya   [${isFalse('nyeri otot')}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'white', 'black', 'white'] },
    ],
    [
      { text: `Pilek`, borderColor: ['black', 'white', 'black', 'white']  },
      { text: `: [${isTrue('pilek')}] Ya   [${isFalse('pilek')}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'white', 'black', 'white'] },
      { text: `Mual/muntah`, borderColor: ['black', 'white', 'black', 'white'] },
      { text: `: [${isTrue('mual atau muntah')}] Ya   [${isFalse('mual atau muntah')}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'white', 'black', 'white'] },
    ],
    [
      { text: `Sakit tenggorokan`, borderColor: ['black', 'white', 'black', 'white'] },
      { text: `: [${isTrue('sakit tenggorokan')}] Ya   [${isFalse('sakit tenggorokan')}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'white', 'black', 'white'] },
      { text: `Nyeri abdomen`, borderColor: ['black', 'white', 'black', 'white'] },
      { text: `: [${isTrue('nyeri abdomen')}] Ya   [${isFalse('nyeri abdomen')}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'white', 'black', 'white'] },
    ],
    [
      { text: `Sesak napas`, borderColor: ['black', 'white', 'black', 'white'] },
      { text: `: [${isTrue('sesak napas')}] Ya   [${isFalse('sesak napas')}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'white', 'black', 'white'] },
      { text: `Diare`, borderColor: ['black', 'white', 'black', 'white'] },
      { text: `: [${isTrue('diare')}] Ya   [${isFalse('diare')}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'white', 'black', 'white'] },
    ],
    [
      { text: `Sakit Kepala`, borderColor: ['black', 'white', 'black', 'black'] },
      { text: `: [${isTrue('sakit kepala')}] Ya   [${isFalse('sakit kepala')}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'white', 'black', 'black'] },
      { text: `Lainnya (sebutkan)`, borderColor: ['black', 'white', 'black', 'black'] },
      { text: `: ${data.last_history.diagnosis_other || '-' }`, borderColor: ['black', 'white', 'black', 'black'] },
    ]
  ]
}

module.exports = {
  render
}