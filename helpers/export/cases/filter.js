const dateFilter = (query) => {
  let createdAt = {}
  if (query.start_date && query.end_date){
    let searchRegExp = new RegExp('/', 'g')
    let min = query.start_date
    let max = query.end_date
    let minDate = min.replace(searchRegExp, '-')
    let maxDate = max.replace(searchRegExp, '-')
    createdAt = {
      "createdAt" :{
        "$gte": new Date(new Date(minDate).setHours(00, 00, 00)),
        "$lt": new Date(new Date(maxDate).setHours(23, 59, 59))
    }}
  }
  return createdAt
}

module.exports = {
  dateFilter
}