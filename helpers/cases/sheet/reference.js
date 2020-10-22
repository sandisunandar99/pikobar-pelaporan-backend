const Unit = require('../../../models/Unit')

const refSymptoms = [
  'Suhu tubuh >= 38 °C',
  'Suhu tubuh < 38 °C',
  'Batuk',
  'Pilek',
  'Sakit Tenggorokan',
  'Sakit Kepala',
  'Sesak Napas',
  'Menggigil',
  'Lemah (malaise)',
  'Nyeri Otot',
  'Mual atau muntah',
  'Nyeri Abdomen',
  'Diare'
]

const refDiseases = [
  'Hamil',
  'Diabetes',
  'Penyakit Jantung',
  'Hipertensi',
  'Keganasan',
  'Gangguan Imunologi',
  'Gagal Ginjal Kronis',
  'Gagal Hati Kronis',
  'PPOK',
]

const findHospital = async (name) => {
  const hospital = await Unit.findOne({
    unit_type: 'rumahsakit',
    name: new RegExp(name.trim(), 'i')
  }).select('_id')

  if (!hospital) {
    return null
  }

  return hospital._id
}

module.exports = {
  refSymptoms,
  refDiseases,
  findHospital,
}
