const mongoose = require('mongoose');

require('../models/Notification');
const Notification = mongoose.model('Notification');


async function getUserNotifications (userId, callback) {
  try {

    let notifications = await Notification
      .find({ recipient: userId, is_read: false })
      .populate([, 'sender', 'recipient'])
      .sort({ createdAt: 'desc'})
      .limit(15)

    notifications = notifications.map(notifications => notifications.toJSONFor())
    
    return callback(null, notifications)
  } catch (error) {
    return callback(null, error)
  }
}

async function getUserNotification (userId, notifId, callback) {
  try {

    let notification = await Notification
      .findOne({ _id: notifId, recipient: userId })
      .populate(['case','sender', 'recipient'])
      .sort({ createdAt: 'desc'})

    notification = notification.toJSONFor()
    
    return callback(null, notification)
  } catch (error) {
    return callback(null, error)
  }
}

module.exports = [
  {
    name: 'services.notifications.get',
    method: getUserNotifications
  },
  {
    name: 'services.notifications.show',
    method: getUserNotification
  }
];

