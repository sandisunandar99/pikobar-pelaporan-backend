const ObjectId = require('mongodb').ObjectID

const findGlobal = async (Schema, id_case, select) => {
  try {
    await Schema.find({ _id: id_case })
      .select([select])
      .sort({ updatedAt: -1 })
  } catch (error) {
    error
  }
}

const deleteGlobal = async (Schema, column, id) => {
  try {
    const columnId = `${column}._id`
    const condition = {
      [columnId]: ObjectId(id)
    }
    const pull = { [column]: { _id: ObjectId(id) } }
    await Schema.updateOne(condition, { $pull: pull })
  } catch (error) {
    error
  }
}

module.exports = {
  findGlobal, deleteGlobal
}
