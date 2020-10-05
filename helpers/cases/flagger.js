const ObjectId = require('mongodb').ObjectID
const closeconProps = [
  'close_contact_parents',
  'close_contact_childs'
]

const doFlagging = async (source, self, Case) => {
  const pre = source === 'pre'
  const cond = self._conditions
  const opt = self._update

  if (!cond || !opt) return

  let prop, filter;

  if (opt['$pull']) {
    prop = Object.keys(opt['$pull'])[0]
    filter = `${prop}._id`
  } else if (opt['$addToSet']) {
    prop = Object.keys(opt['$addToSet'])[0]
    filter = '_id'
  }

  let id = cond._id || cond[`${prop}._id`]

  if (closeconProps.includes(prop)) {
    if (pre) return
    return handleClosecontactFlag(Case, cond.id_case, prop)
  }

  if (!id || !prop) return

  const record = await Case
    .findOne({ [filter]: id })
    .select([prop])

  if (record && record[prop]) {
    if (pre && record[prop].length) {
      id = record._id
      record[prop].shift()
    }

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

    return await Case.updateOne(
      { _id: ObjectId(id) },
      { $set: { [col]: status } }
    )
  }

}

const handleClosecontactFlag = async (Case, idCase, prop) => {
  if (!idCase || !prop) return

  const record = await Case
    .findOne({ id_case: idCase })
    .select(closeconProps)

  if (!record) return

  const {
    close_contact_childs,
    close_contact_parents,
  } = record

  let status = 0, childs = null, parents = null;

  if (close_contact_childs) {
    childs = close_contact_childs.filter(v => !!v.is_access_granted)
  }

  if (close_contact_parents) {
    parents = close_contact_parents.filter(v => !!v.is_access_granted)
  }

  if (childs.length || parents.length) {
    status = 1
  }

  return await Case.updateOne(
    { id_case: idCase },
    { $set: { status_closecontact: status }
  })
}

module.exports = {
  doFlagging,
}
