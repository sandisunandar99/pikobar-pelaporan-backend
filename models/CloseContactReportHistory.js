const mongoose = require('mongoose')
const { TYPE } = require('./helpers').MONGOOSE_SCHEMA

const REF_CLOSE_CONTACT = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloseContactReport',
    required: true
}

const CloseContactReportHistorySchema = new mongoose.Schema({
    diagnosis_symptoms: TYPE.ARRAY.DEFAULT,
    diagnosis_diseases: TYPE.ARRAY.DEFAULT,
    vaccination_influenza_vaccine: TYPE.BOOLEAN.DEFAULT,
    vaccination_influenza_vaccine_date: TYPE.DATE.DEFAULT,
    vaccination_pvc_vaccine: TYPE.BOOLEAN.DEFAULT,
    vaccination_pvc_vaccine_date: TYPE.DATE.DEFAULT,
    test_nasal_swab: TYPE.BOOLEAN.DEFAULT,
    test_nasal_swab_date: TYPE.DATE.DEFAULT,
    test_throat_swab: TYPE.BOOLEAN.DEFAULT,
    test_throat_swab_date: TYPE.DATE.DEFAULT,
    test_nasopharyngeal_swab: TYPE.BOOLEAN.DEFAULT,
    test_nasopharyngeal_swab_date: TYPE.DATE.DEFAULT,
    test_orofaringeal_swab: TYPE.BOOLEAN.DEFAULT,
    test_orofaringeal_swab_date: TYPE.DATE.DEFAULT,
    close_contact_report : REF_CLOSE_CONTACT
}, { timestamps : true })

module.exports = mongoose.model(
    'CloseContactReportHistory',
    CloseContactReportHistorySchema)
