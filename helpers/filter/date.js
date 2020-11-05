const dateFilter = (query, columnDate) => {
  let test_date = {}
  if (query.min_date && query.max_date) {
    let searchRegExp = new RegExp('/', 'g')
    let min = query.min_date
    let max = query.max_date
    let minDate = min.replace(searchRegExp, '-')
    let maxDate = max.replace(searchRegExp, '-')
    test_date = {
      [columnDate]: {
        "$gte": new Date(new Date(minDate).setHours(00, 00, 00)),
        "$lt": new Date(new Date(maxDate).setHours(23, 59, 59))
      }
    }
  }

  return test_date
}

module.exports = {
  dateFilter
}