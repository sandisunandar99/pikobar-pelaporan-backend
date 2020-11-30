const findGlobal = async (Schema, id_case, select) => {
  try {
    return await Schema.find({ _id: id_case })
      .select(select)
      .sort({ updatedAt: -1 })
  } catch (error) {
    return error
  }
}

const deleteGlobal = async (Schema, condition, pull) => {
  try {
    return await Schema.updateOne(condition, { $pull: pull })
  } catch (error) {
    return error
  }
}

module.exports = {
  findGlobal, deleteGlobal
}
