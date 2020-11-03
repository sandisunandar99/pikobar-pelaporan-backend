const references = {}
const { component } = require('./helper')
const { CRITERIA } = require('../../constant')
const Unit = require('../../../models/Unit')

references.refSymptoms = [
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

references.refDiseases = [
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

references.refApd = [
  'Gown',
  'Masker Bedah',
  'Sarung Tangan',
  'Masker N95 Standar FFP3',
  'FFP3',
  'Kacamata Pelindung Goggle',
  'Tidak Sama Sekali',
]

references.refHealthWorkers = [
  component('Dokter', 'dokter'),
  component('Perawat', 'perawat'),
  component('Farmasi', 'farmasi'),
  component('Dokter Spesialis Paru', 'dokter spesialis paru'),
  component('Dokter Spesialis Lain', 'dokter spesialis lain'),
  component('Bidan', 'bidan'),
  component('Ahli Gizi', 'ahli gizi'),
  component('Tenaga Kesehatan Masyarakat', 'tenaga kesehatan masyarakat'),
  component('Lainnya', 'lainnya'),
]

references.refTravelingType = [
  component('Dari Luar Negeri', 'dari luar negeri'),
  component('Dari Luar Kota', 'dari luar negeri'),
]

references.refPlaceCategories = [
  component('Pasar Modern / Tradisional', 'pasar modern / tradisional'),
  component('Pasar Hewan', 'pasar hewan'),
  component('Fasilitas Kesehatan', 'fasilitas kesehatan'),
  component('Tempat Wisata', 'tempat wisata'),
  component('Restoran', 'restoran'),
  component('Tempat Publik Lainnya', 'tempat publik lainnya'),
]

references.refTransmissionType = [
  component(1, 'kasus impor'),
  component(2, 'kasus kontak dengan kasus impor'),
  component(3, 'kasus lokal tanpa diketahui sumber penuralannya'),
  component(4, 'kasus lokal dengan kaitan epidemiologis'),
]

references.refClusterType = [
  component(1, 'lainnya'),
  component(2, 'nakes'),
  component(3, 'pasar/pusat perbelanjaan/toko'),
  component(4, 'pabrik'),
  component(5, 'perkantoran'),
  component(6, 'tempat wisata'),
  component(7, 'tempat ibadah'),
  component(8, 'rumah tangga'),
  component(9, 'rumah makan'),
]

references.refIncomes = [
  component(0, 'tidak berpenghasilan'),
  component(1, '< 1 juta'),
  component(2, '1 s/d 3 juta'),
  component(3, '3 s/d 5 juta'),
  component(4, '> 5 juta'),
]

references.refCriterias = [
  component(CRITERIA.CLOSE, 'kontak erat'),
  component(CRITERIA.SUS, 'suspek'),
  component(CRITERIA.CONF, 'konfirmasi'),
  component(CRITERIA.PROB, 'probable'),
]

references.refFinalResults = [
  component('0', 'negatif'),
  component('1', 'selesai isolasi/sembuh'),
  component('2', 'meninggal'),
  component('3', 'discarded'),
  component('4', 'masih sakit'),
  component('5', 'masih dikarantina'),
]

references.refActivities = [
  component(0, 'sedenter'),
  component(1, '<150 menit per-minggu'),
  component(2, '>150 menit per-minggu'),
]

references.findHospital = async (name) => {
  const hospital = await Unit.findOne({
    unit_type: 'rumahsakit',
    name: new RegExp(name.trim(), 'i')
  }).select('_id')

  if (!hospital) {
    return null
  }

  return hospital._id
}

module.exports = references
