const mongoose = require('mongoose')
const refCloseContact = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloseContactReport',
    required: [true, "can't be blank"]
}

const CloseContactReportHistorySchema = new mongoose.Schema({
    diagnosis_symptoms: Array,
    diagnosis_diseases: Array,
    vaccination_influenza_vaccine: Boolean,
    vaccination_influenza_vaccine_date: Date,
    vaccination_pvc_vaccine: Boolean,
    vaccination_pvc_vaccine_date: Date,
    test_nasal_swab: Boolean,
    test_nasal_swab_date: Date,
    test_throat_swab: Boolean,
    test_throat_swab_date: Date,
    test_nasopharyngeal_swab: Boolean,
    test_nasopharyngeal_swab_date: Date,
    test_orofaringeal_swab: Boolean,
    test_orofaringeal_swab_date: Date,
    close_contact_report : refCloseContact
}, { timestamps : true })

module.exports = mongoose.model(
    'CloseContactReportHistory',
    CloseContactReportHistorySchema)
