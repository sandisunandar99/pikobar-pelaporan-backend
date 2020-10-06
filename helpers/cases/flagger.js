const ObjectId = require('mongodb').ObjectID
const closeconProps = [
  'close_contact_parents',
  'close_contact_childs'
]

const getFieldName = (prop) => {
  let fieldName = null

  if (prop === 'visited_local_area') {
    fieldName = 'status_travel_local'
  } else if (prop === 'visited_public_place') {
    fieldName = 'status_travel_public'
  } else if (prop === 'travelling_history') {
    fieldName = 'status_travel_import'
  } else if (prop === 'inspection_support') {
    fieldName = 'status_inspection_support'
  }

  return fieldName
}

const getProp = (opt) => {
  let prop

  if (opt['$pull']) {
    prop = Object.keys(opt['$pull'])[0]
  } else if (opt['$addToSet']) {
    prop = Object.keys(opt['$addToSet'])[0]
  }

  return prop
}

const getFilter = (opt, prop) => {
  let filter

  if (opt['$pull']) {
    filter = `${prop}._id`
  } else if (opt['$addToSet']) {
    filter = '_id'
  }

  return filter
}

const doFlagging = async (source, self, Case) => {
  const pre = source === 'pre'
  const cond = self._conditions
  const opt = self._update

  if (!cond || !opt) return

  const prop = getProp(opt)
  const filter = getFilter(opt, prop)

  let id = cond._id || cond[`${prop}._id`]

  if (closeconProps.includes(prop)) {
    if (pre) return
    return handleClosecontactFlag(Case, cond.id_case)
  }

  if (!id || !prop) return

  const record = await Case.findOne({ [filter]: id }).select([prop])

  if (record && record[prop]) {
    if (pre && record[prop].length) {
      id = record._id
      record[prop].shift()
    }

    const status = record[prop].length ? 1 : 0

    const field = getFieldName(prop)

    if (field) {
      await Case.updateOne(
        { _id: ObjectId(id) },
        { $set: { [field]: status } }
      )
    }
  }

}

const handleClosecontactFlag = async (Case, idCase) => {
  const rules = { id_case: idCase }

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

  await Case.updateOne(rules, {
    $set: { status_closecontact: status }
  })
}

module.exports = {
  doFlagging,
}
