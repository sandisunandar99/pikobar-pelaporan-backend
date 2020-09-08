const PublicPlace = require('../models/History')
const ObjectId = require('mongodb').ObjectID

const createPublicPlace = async (payload, id_history, callback) => {
  try {
    const inserted = await PublicPlace.update(
      { "_id": ObjectId(id_history) },
      { $set: { 'has_visited_public_place': true },
        $addToSet: {
          "visited_public_place": {
            "public_place_category": payload.public_place_category,
            "public_place_name": payload.public_place_name,
            "public_place_address": payload.public_place_address,
            "public_place_date_visited": payload.public_place_date_visited,
            "public_place_duration_visited": payload.public_place_duration_visited
          }
        }
      }, { $new: true })
    callback(null, inserted)
  } catch (error) {
    callback(error, null)
  }
}

const listPublicPlace = async (id_history, callback) => {
  try {
    const result = await PublicPlace.find({_id: id_history})
    .select(["visited_public_place"])
    .sort({ updatedAt:-1 })
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

const updatePublicPlace = async (id_public_place, payload, callback) => {
  try {
    const updated = await PublicPlace.update(
      {
        "visited_public_place._id": ObjectId(id_public_place)
      },
      {
        "$set": {
        "visited_public_place.$.public_place_category": payload.public_place_category,
        "visited_public_place.$.public_place_name": payload.public_place_name,
        "visited_public_place.$.public_place_address": payload.public_place_address,
        "visited_public_place.$.public_place_date_visited": payload.public_place_date_visited,
        "visited_public_place.$.public_place_duration_visited": payload.public_place_duration_visited
      }}, { $new : true })
    callback(null, updated)
  } catch (error) {
    callback(error, null)
  }
}

const deletePublicPlace = async (id_history, id_public_place, callback) => {
  try {
    const result = await PublicPlace.findOneAndUpdate({_id : id_history},
      { $pull: { visited_public_place: { _id: ObjectId(id_public_place) }}}
    )
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.public_place.create',
    method: createPublicPlace
  },{
    name: 'services.public_place.read',
    method: listPublicPlace
  },{
    name: 'services.public_place.update',
    method: updatePublicPlace
  },{
    name: 'services.public_place.delete',
    method: deletePublicPlace
  },
]

