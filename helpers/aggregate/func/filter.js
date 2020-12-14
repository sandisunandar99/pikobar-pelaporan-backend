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
    groups = { $toUpper : "$address_district_name"}
  }else{
    groups = { $toUpper : "$address_subdistrict_name"}
  }
  return groups
}

const rdtFilter = (query) => {
  let queryStrings = {}
  if (query.test_tools) {
    const splits = query.test_tools.split('-');
    if(splits[0] && splits[1]) {
      queryStrings = { "tool_tester": splits[0], "final_result": splits[1] }
    }else{
      queryStrings = { "final_result": splits[0] }
    }
  }

  return queryStrings;
}

module.exports = {
  searching, byRole, rdtFilter
}