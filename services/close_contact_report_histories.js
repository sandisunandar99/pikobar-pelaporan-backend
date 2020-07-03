require('../models/CloseContactReport')
require('../models/CloseContactReportHistory')

const mongoose = require('mongoose');
const CloseContactReport = mongoose.model('CloseContactReport')
const CloseContactReportHistory = mongoose.model('CloseContactReportHistory')

async function eventCreate (closeContactReport, insertedReport) {
  try {
    await CloseContactReport
      .findByIdAndUpdate(closeContactReport, {
        latest_report_history: insertedReport._id
      })
  } catch (error) {
    console.log(error)
  }
}

async function create (closeContactReport, payload, callback) {
  try {
    let result = new CloseContactReportHistory(
      Object.assign(payload, {
        close_contact_report: closeContactReport
      }))
  
    result = await result.save()
    eventCreate(closeContactReport, result)
    return callback(null, result)
  } catch (error) {
    return callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.closeContactReportHistories.create',
    method: create
  }
];
