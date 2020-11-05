const dateFilter = (query, columnDate) => {
  let dates = {}
  if (query.min_date && query.max_date) {
    let searchRegExp = new RegExp('/', 'g')
    let min = query.min_date
    let max = query.max_date
    let minDate = min.replace(searchRegExp, '-')
    let maxDate = max.replace(searchRegExp, '-')
    dates = {
      [columnDate]: {
        "$gte": new Date(new Date(minDate).setHours(00, 00, 00)),
        "$lt": new Date(new Date(maxDate).setHours(23, 59, 59))
      }
    }
  }

  return dates
}

module.exports = {
  dateFilter
}