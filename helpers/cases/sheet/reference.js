const references = {}
const Unit = require('../../../models/Unit')
const {
  CRITERIA, INSPECTION_TYPES, SPECIMEN_TYPES,
} = require('../../constant')

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
  { value: 'Dokter', text: 'doker' },
  { value: 'Perawat', text: 'perawat' },
  { value: 'Farmasi', text: 'farmasi' },
  { value: 'Dokter Spesialis Paru', text: 'dokter spesialis paru' },
  { value: 'Dokter Spesialis Lain', text: 'dokter spesialis lain' },
  { value: 'Bidan', text: 'bidan' },
  { value: 'Ahli Gizi', text: 'ahli gizi' },
  { value: 'Tenaga Kesehatan Masyarakat', text: 'tenaga kesehatan masyarakat' },
  { value: 'Lainnya', text: 'lainnya' },
]

references.refTravelingType = [
  { value: 'Dari Luar Negeri', text: 'dari luar negeri' },
  { value: 'Dari Luar Kota', text: 'dari luar negeri' },
]

references.refPlaceCategories = [
  { value: 'Pasar Modern / Tradisional', text: 'pasar modern / tradisional' },
  { value: 'Pasar Hewan', text: 'pasar hewan' },
  { value: 'Fasilitas Kesehatan', text: 'fasilitas kesehatan' },
  { value: 'Tempat Wisata', text: 'tempat wisata' },
  { value: 'Restoran', text: 'restoran' },
  { value: 'Tempat Publik Lainnya', text: 'tempat publik lainnya' },
]

references.refTransmissionType = [
  { value: 1, text: 'kasus impor' },
  { value: 2, text: 'kasus kontak dengan kasus impor' },
  { value: 3, text: 'kasus lokal tanpa diketahui sumber penuralannya' },
  { value: 4, text: 'kasus lokal dengan kaitan epidemiologis' },
]

references.refClusterType = [
  { value: 1, text: 'lainnya' },
  { value: 2, text: 'nakes' },
  { value: 3, text: 'pasar/pusat perbelanjaan/toko' },
  { value: 4, text: 'pabrik' },
  { value: 5, text: 'perkantoran' },
  { value: 6, text: 'tempat wisata' },
  { value: 7, text: 'tempat ibadah' },
  { value: 8, text: 'rumah tangga' },
  { value: 9, text: 'rumah makan' },
]

references.refIncomes = [
  { value: 0, text: 'tidak berpenghasilan' },
  { value: 1, text: '< 1 juta' },
  { value: 2, text: '1 s/d 3 juta' },
  { value: 3, text: '3 s/d 5 juta' },
  { value: 4, text: '> 5 juta' },
]

references.refCriterias = [
  { value: CRITERIA.CLOSE, text: 'kontak erat' },
  { value: CRITERIA.SUS, text: 'suspek' },
  { value: CRITERIA.CONF, text: 'konfirmasi' },
  { value: CRITERIA.PROB, text: 'probable' },
]

references.refActivities = [
  { value: 0, text: 'sedenter' },
  { value: 1, text: '<150 menit per-minggu' },
  { value: 2, text: '>150 menit per-minggu' },
]

references.refFinalResults = [
  { value: 0, text: 'negatif' },
  { value: 1, text: 'selesai isolasi/sembuh' },
  { value: 2, text: 'meninggal' },
  { value: 3, text: 'discarded' },
  { value: 4, text: 'masih sakit' },
  { value: 5, text: 'masih dikarantina' },
]

references.refInspectionTypes = [
  { value: INSPECTION_TYPES.PCR, text: 'pcr' },
  { value: INSPECTION_TYPES.RAPID, text: 'rapid' },
  { value: INSPECTION_TYPES.RADIOLOGY, text: 'radiologi' },
  { value: INSPECTION_TYPES.CT_SCAN, text: 'ct-scan' },
  { value: INSPECTION_TYPES.TCM_SARS, text: 'tcm-sars cov-2' },
]

references.refSpecimenTypes = [
  { value: null, text: null }, // try to fix similiar blocks
  { value: SPECIMEN_TYPES.SWAB_NASO, text: 'swab nasofaring' },
  { value: SPECIMEN_TYPES.SWAB_OROF, text: 'swab orofaring' },
  { value: SPECIMEN_TYPES.SWAB_NASO_OROF, text: 'swab naso-orofaring' },
  { value: SPECIMEN_TYPES.BLOOD, text: 'darah' },
  { value: SPECIMEN_TYPES.SPUTUM, text: 'dahak' },
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
