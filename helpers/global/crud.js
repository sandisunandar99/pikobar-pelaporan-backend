const ObjectId = require('mongodb').ObjectID

const findGlobal = async (Schema, id_case, select) => {
  return await Schema.find({ _id: id_case })
    .select([select])
    .sort({ updatedAt: -1 })
}

const deleteGlobal = async (Schema, column, id) => {
  const columnId = `${column}._id`
  const condition = {
    [columnId]: ObjectId(id)
  }
  const pull = { [column]: { _id: ObjectId(id) } }
  return await Schema.updateOne(condition, { $pull: pull })
}

module.exports = {
  findGlobal, deleteGlobal
}
