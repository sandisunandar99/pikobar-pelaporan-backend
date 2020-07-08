const mongoose = require('mongoose')

const REF_CLOSE_CONTACT = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloseContactReport',
    required: true
}

const CloseContactReportHistorySchema = new mongoose.Schema({
    diagnosis_symptoms: { type: Array, default: [] },
    diagnosis_symptoms_date: { type: Date, default: null },
    diagnosis_diseases: { type: Array, default: [] },
    vaccination_influenza_vaccine: { type: Boolean, default: false },
    vaccination_influenza_vaccine_date: { type: Date, default: null },
    vaccination_pvc_vaccine: { type: Boolean, default: false },
    vaccination_pvc_vaccine_date: { type: Date, default: null },
    test_nasal_swab: { type: Boolean, default: false },
    test_nasal_swab_date: { type: Date, default: null },
    test_nasal_swab_result: { type: String, default: null },
    test_throat_swab: { type: Boolean, default: false },
    test_throat_swab_date: { type: Date, default: null },
    test_throat_swab_result: { type: String, default: null },
    test_nasopharyngeal_swab: { type: Boolean, default: false },
    test_nasopharyngeal_swab_date: { type: Date, default: null },
    test_nasopharyngeal_swab_result: { type: String, default: null },
    test_orofaringeal_swab: { type: Boolean, default: false },
    test_orofaringeal_swab_date: { type: Date, default: null },
    test_orofaringeal_swab_result: { type: String, default: null },
    test_serum: { type: Boolean, default: false },
    close_contact_report : REF_CLOSE_CONTACT
}, { timestamps : true })

module.exports = mongoose.model(
    'CloseContactReportHistory',
    CloseContactReportHistorySchema)
