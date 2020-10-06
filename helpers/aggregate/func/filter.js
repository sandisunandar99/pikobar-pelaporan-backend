const { countByRole, thisUnitCaseAuthors } = require("../../rolecheck")
const { filterCase } = require("../../filter/casefilter")

const searching = async (query, user) => {
  const caseAuthors = await thisUnitCaseAuthors(user)
  let resultFilter = {}
  let searchRegExp = new RegExp('/', 'g')
  if (query.start_date){
    let queryDate = query.start_date
    let searchDate = queryDate.replace(searchRegExp, '-')
    resultFilter = {
      "createdAt":{
        "$gte": new Date(new Date(searchDate).setHours(00, 00, 00)),
        "$lt": new Date(new Date(searchDate).setHours(23, 59, 59))
      }
    }
  }else{
    resultFilter
  }

  return {
    ...await filterCase(user, query),
    ...countByRole(user, caseAuthors),
    ...resultFilter
  }
}

const byRole = (ROLE, user) =>{
  let groups
  if([ROLE.ADMIN, ROLE.PROVINCE].includes(user.role)){
    groups = { $toUpper : "$address_district_name"}
  }else{
    groups = { $toUpper : "$address_subdistrict_name"}
  }
  return groups
}

module.exports = {
  searching, byRole
}