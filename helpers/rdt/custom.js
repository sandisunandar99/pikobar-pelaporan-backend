const getLastRdtNumber = (number, res, substr) => {
  if (res.length > 0) {
    // ambil 5 karakter terakhir yg merupakan nomor urut dari id_rdt
    let str = res[0].code_test
    number = (Number(str.substring(substr)) + 1)
  }

  return number
}

const generateTool = () => {

  let code_tool_tester
  let pcr_count = 0
  let rdt_count = 0
  if (payload.tool_tester === "PCR") {
    pcr_count += 1
    code_tool_tester = "PCR-"
  }else{
    rdt_count += 1
    code_tool_tester = "RDT-"
  }

  return { code_tool_tester, pcr_count, rdt_count }
}

module.exports ={
  getLastRdtNumber, generateTool
}