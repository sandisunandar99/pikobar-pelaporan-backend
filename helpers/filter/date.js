let searchRegExp = new RegExp('/', 'g')

const dateFilter = (query, columnDate) => {
  let dates = {}
  if (query.min_date && query.max_date) {
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

const oneDate = (query, columnDate) => {
  let dates = {}
  if (query.start_date) {
    let search = query.start_date
    let searchDate = search.replace(searchRegExp, '-')
    dates = {
      [columnDate]: {
        "$gte": new Date(new Date(searchDate).setHours(00, 00, 00)),
        "$lt": new Date(new Date(searchDate).setHours(23, 59, 59))
      }
    }
  }

  return dates
}


module.exports = {
  dateFilter, oneDate
}