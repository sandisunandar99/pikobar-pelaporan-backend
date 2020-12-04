const PublicPlace = require('../models/Case')
const ObjectId = require('mongodb').ObjectID
const { findGlobal, deleteGlobal } = require('../helpers/global/crud')

const createPublicPlace = async (payload, id_case, callback) => {
  try {
    const inserted = await PublicPlace.updateOne(
      { "_id": ObjectId(id_case) },
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
      }, { new: true })
    callback(null, inserted)
  } catch (error) {
    callback(error, null)
  }
}

const listPublicPlace = async (id_case, callback) => {
  try {
    const id = id_case
    const result = await findGlobal(PublicPlace, id, "visited_public_place")
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

const updatePublicPlace = async (id_public_place, payload, callback) => {
  try {
    const updated = await PublicPlace.updateOne({
      "visited_public_place._id": ObjectId(id_public_place)
    },
    { "$set": {
      "visited_public_place.$.public_place_category": payload.public_place_category,
      "visited_public_place.$.public_place_name": payload.public_place_name,
      "visited_public_place.$.public_place_address": payload.public_place_address,
      "visited_public_place.$.public_place_date_visited": payload.public_place_date_visited,
      "visited_public_place.$.public_place_duration_visited": payload.public_place_duration_visited
    }}, { new : true })
    callback(null, updated)
  } catch (error) {
    callback(error, null)
  }
}

const deletePublicPlace = async (id_public_place, callback) => {
  try {
    const deleted = await deleteGlobal(PublicPlace, "visited_public_place", id_public_place)
    callback(null, deleted)
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

