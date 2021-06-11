const getLastNumber = (number, res, substr, name) => {
  if (res.length > 0) {
    // ambil 5 karakter terakhir yg merupakan nomor urut dari id_rdt or cases
    let str = res[0][name]
    number = (Number(str.substring(substr)) + 1)
  }

  return number
}

const generateTool = (payload) => {

  let code_tool_tester
  let pcr_count = 0
  let rdt_count = 0
  if (payload.tool_tester === "PCR") {
    pcr_count += 1
    code_tool_tester = "PCR-"
  } else {
    rdt_count += 1
    code_tool_tester = "RDT-"
  }

  return { code_tool_tester, pcr_count, rdt_count }
}

const loopFilter = (i) => {
  const { CRITERIA } = require('../helpers/constant')
  if (i.target === CRITERIA.CLOSE) i.target = CRITERIA.CLOSE_ID
  if (i.target === CRITERIA.SUS) i.target = CRITERIA.SUS_ID
  if (i.target === CRITERIA.PROB) i.target = CRITERIA.PROB_ID
  if (i.target === CRITERIA.CONF) i.target = CRITERIA.CONF_ID

  return i
}

module.exports = {
  getLastNumber, generateTool, loopFilter
}