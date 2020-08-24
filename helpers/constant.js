module.exports = {
  VERIFIED_STATUS: {
    PENDING: 'pending',
    VERIFIED: 'verified',
  },
  ROLE: {
    ADMIN: 'superadmin',
    PROVINCE: 'dinkesprov',
    KOTAKAB: 'dinkeskota',
    FASKES: 'faskes',
  },
  CASE: {
    CODE: 'covid-',
    PRE: 'precovid-'
  },
  CRITERIA:{
    CLOSE: 'CLOSECONTACT',
    SUS: 'SUSPECT',
    PROB: 'PROBABLE',
    CONF: 'CONFIRMATION',
    CLOSE_ID: 'Kontak Erat',
    SUS_ID: 'Suspek',
    PROB_ID: 'Probable',
    CONF_ID: 'Konfirmasi'
  },
  INCOME:{
    NO_INCONME: 'Tidak ber penghasilan',
    SMALLER: '< 1juta',
    ONE_TO3: '1 s/d 3 juta',
    THREET_O5: '3 s/d 5 juta',
    GREATHER_5: '> 5juta'
  },
  PATIENT_STATUS: {
    NEGATIVE: 'Negatif',
    DONE: 'Selesai Isolasi/Sembuh',
    DEAD: 'Meninggal',
    DISCARDED: 'Discarded',
    SICK: 'Masih Sakit',
    QUARANTINED: 'Masih Dikarantina'
  },
  WHERE_GLOBAL: { delete_status: { $ne: 'deleted' }, verified_status: 'verified' },
  GENDER: {
    MALE: 'L',
    FEMALE: 'P',
    M: 'male',
    F: 'female',
    ID_L: 'Laki-Laki',
    ID_P: 'Perempuan'
  },
  PYSICHAL: {
    SEDENTER: 'Sedenter',
    SMALLER_150MINUTE: 'Latihan fisik < 150 menit',
    GREATHER_150MINUTE: 'Latihan fisik > 150 menit'
  },
  ANSWER: {
    YES: 'Yes',
    NO: 'No',
    YA: 'Ya',
    TIDAK: 'Tidak',
    TIDAK_TAHU: 'Tidak Tahu'
  },
  DEFAULT_PROVINCE: {
    CODE: '32',
    NAME: 'JAWA BARAT'
  },
  REF: {
    CLOSE_CONTACT: {
      TYPES: {
        OTHER: 1,
        HOME: 2,
        OFFICER: 3
      },
      PLACES: {
        OTHER: 1,
        HOME: 2,
        WORK: 3,
        TOUR: 4,
        MEDICAL: 5
      }
    }
  }
}