const ObjectId = require('mongodb').ObjectID

const doFlagging = async (self, Case) => {
  const cond = self._conditions
  const opt = self._update

  if (!cond || !cond._id || !opt['$addToSet']) {
    return
  }

  const id = self._conditions._id
  const prop = Object.keys(opt['$addToSet'])[0]

  if (!prop) return

  const record = await Case
    .findById(id)
    .select([prop])

  if (!record || !record[prop]) return

  const status = record[prop].length ? 1 : 0

  let col = null
  if (prop === 'visited_local_area') {
    col = 'status_travel_local'
  } else if (prop === 'visited_public_place') {
    col = 'status_travel_public'
  } else if (prop === 'travelling_history') {
    col = 'status_travel_import'
  } else if (prop === 'inspection_support') {
    col = 'status_inspection_support'
  }

  if (!col) return

  await Case.updateOne(
    { _id: ObjectId(id) },
    { $set: { [col]: status } }
  )
}

module.exports = {
  doFlagging,
}
