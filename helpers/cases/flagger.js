const ObjectId = require('mongodb').ObjectID
const closeconProps = [
  'close_contact_parents',
  'close_contact_childs'
]

const doFlagging = async (self, Case) => {
  const cond = self._conditions
  const opt = self._update

  if (!cond || !opt['$addToSet']) return

  const id = cond._id
  const prop = Object.keys(opt['$addToSet'])[0]

  if (closeconProps.includes(prop)) {
    return handleClosecontactFlag(Case, cond, opt)
  }

  if (!id || !prop) return

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

  return await Case.updateOne(
    { _id: ObjectId(id) },
    { $set: { [col]: status } }
  )
}

const handleClosecontactFlag = async (Case, cond, opt) => {
  const idCase = cond.id_case
  const prop = Object.keys(opt['$addToSet'])[0]
  const rules = { id_case: idCase }

  if (!idCase || !prop) return

  const record = await Case
    .findOne(rules)
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

  return await Case.updateOne(rules,{
    $set: { status_closecontact: status }
  })
}

module.exports = {
  doFlagging,
}
