const LocalTransmission = require('../models/History')
const ObjectId = require('mongodb').ObjectID

const createLocalTransmission = async (payload, id_history, callback) => {
  try {
    const inserted = await LocalTransmission.update(
      { "_id": ObjectId(id_history) },
      { $set: { 'visited_local_area_before_sick_14_days': true },
        $addToSet: {
          'visited_local_area': {
            "visited_local_area_province": payload.visited_local_area_province,
            "visited_local_area_city": payload.visited_local_area_city
          }
        }
      }, { $new: true })
    callback(null, inserted)
  } catch (error) {
    callback(error, null)
  }
}

const listLocalTransmission = async (id_history, callback) => {
  try {
    const result = await LocalTransmission.find({ _id: id_history })
      .select(["visited_local_area"])
      .sort({ updatedAt: -1 })
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

const updateLocalTransmission = async (id_local_transmission, payload, callback) => {
  try {
    const updated = await LocalTransmission.update(
      {
        "visited_local_area._id": ObjectId(id_local_transmission)
      },
      { $set: {
          "visited_local_area.$.visited_local_area_province": payload.visited_local_area_province,
          "visited_local_area.$.visited_local_area_city": payload.visited_local_area_city
        }
      }, { $new: true })
    callback(null, updated)
  } catch (error) {
    callback(error, null)
  }
}

const deleteLocalTransmission = async (id_history, id_local_transmission, callback) => {
  try {
    const result = await LocalTransmission.findOneAndUpdate({ _id: id_history },
      { $pull: { visited_local_area: { _id: ObjectId(id_local_transmission) } } }
    )
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.local_transmission.create',
    method: createLocalTransmission
  }, {
    name: 'services.local_transmission.read',
    method: listLocalTransmission
  }, {
    name: 'services.local_transmission.update',
    method: updateLocalTransmission
  }, {
    name: 'services.local_transmission.delete',
    method: deleteLocalTransmission
  },
]

