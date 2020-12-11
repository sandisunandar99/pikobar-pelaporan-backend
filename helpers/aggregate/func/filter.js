const { countByRole, thisUnitCaseAuthors } = require("../../rolecheck")
const { filterCase } = require("../../filter/casefilter")
const { oneDate } = require("../../filter/date")

const searching = async (query, user) => {
  const caseAuthors = await thisUnitCaseAuthors(user)
  const resultFilter = oneDate(query, "createdAt")

  return {
    ...await filterCase(user, query),
    ...countByRole(user, caseAuthors),
    ...resultFilter
  }
}

const byRole = (ROLE, user) =>{
  let groups
  if([ROLE.ADMIN, ROLE.PROVINCE].includes(user.role)){
    // groups = { $toUpper : "$address_district_name"}
    groups = { $toUpper : "$kemendagri_kabupaten_nama"}
  }else{
    groups = { $toUpper : "$address_subdistrict_name"}
  }
  return groups
}

module.exports = {
  searching, byRole
}