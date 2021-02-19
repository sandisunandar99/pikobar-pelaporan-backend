const sortCondition = (query) => {
  let sort = { updatedAt: -1 };
  if (query.sort && query.sort.split) {
    let splits = query.sort.split(':')
    sort.last_date_status_patient = splits[1] === 'desc' ? -1 : 1
    sort[splits[0]] = splits[1] === 'desc' ? -1 : 1
  }

  return sort
}

module.exports = { sortCondition }