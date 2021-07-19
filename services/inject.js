const Case = require('../models/Case')
const History = require('../models/History')
const Rdt = require('../models/Rdt')
const DistrictCity = require('../models/DistrictCity')
const RdtHistory = require('../models/RdtHistory')

const lastHistory = async (query, callback) => {
  try {
    const result = await Case.find({
      delete_status: { $ne: "deleted" },
      last_history: { $exists: false }
    })
    .select(["status", "stage", "final_result"])
    .sort({_id:-1})
    result.map(async res => {
      const bodys = {
        case: res._id,
        status: res.status,
        stage: res.stage,
        final_result: res.final_result,
        current_location_type: 'OTHERS'
      }
      const saveHistory = await History.create(bodys)
      await Case.findOneAndUpdate({ _id: saveHistory.case }, {
        last_history: saveHistory._id
      }, { upsert: true })
    })
    callback(null, result.length)
  } catch (error) {
    callback(error, null)
  }
}

// const returnPayload = x => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(x)
//       resultForResnpose.push(x)
//     }, 100)
//   })
// }

// const getCountRdt = async (code) => {
//   try {
//     const checkDistrictDinkes = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code }).lean()
//     const checkCodeTest = await Rdt.find({ address_district_code: code }).sort({ code_test: -1 }).lean()
//     let count = getLastRdtNumber(1, checkCodeTest, 10, 'code_test');
//     return {
//       prov_city_code: code,
//       dinkes_code: checkDistrictDinkes.dinkes_kota_kode,
//       count: count
//     }
//   } catch (error) {
//     return error.toString()
//   }
// }

// const injectRdt = async (request, callback) => {
//   let payload = request.payload
//   let author = request.auth.credentials.user
//   let resultForResnpose = []

//   const process = async () => {
//     for (const payloads of payload) {
//       const result = await returnPayload(payloads)
//       const countRdt = await getCountRdt(result.address_district_code)

//       let date = new Date().getFullYear().toString()
//       let code_test = "PTS-"
//       code_test += countRdt.dinkes_code
//       code_test += date.substr(2, 2)
//       code_test += "0".repeat(5 - countRdt.count.toString().length)
//       code_test += countRdt.count

//       let code_tool_tester
//       let pcr_count = 0
//       let rdt_count = 0
//       if (result.tool_tester === "PCR") {
//         pcr_count += 1
//         code_tool_tester = "PCR-"
//       } else {
//         rdt_count += 1
//         code_tool_tester = "RDT-"
//       }
//       code_tool_tester += countRdt.dinkes_code
//       code_tool_tester += date.substr(2, 2)
//       code_tool_tester += "0".repeat(5 - countRdt.count.toString().length)
//       code_tool_tester += countRdt.count

//       let id_case = null
//       let codes = {
//         code_test: (code_test === undefined ? "" : code_test),
//         code_tool_tester: (code_tool_tester === undefined ? "" : code_tool_tester),
//         id_case: (id_case === undefined ? "" : id_case),
//         author_district_code: author.code_district_city,
//         author_district_name: author.name_district_city,
//         rdt_count: rdt_count,
//         pcr_count: pcr_count,
//         source_data: "external"
//       }

//       let rdt = new Rdt(Object.assign(codes, result))
//       rdt = Object.assign(rdt, { author })
//       rdt.save().then(rdt => {
//         let arr = {...codes, ...result}
//         let rdtHistory = new RdtHistory(Object.assign(arr,{rdt}))
//         rdtHistory.save((err, item) => {
//           if(err) console.log(err)

//           let last_history = { last_history: item._id }
//           rdt = Object.assign(rdt, last_history)
//           return rdt.save()
//         })
//       })

//     }
//   }

//   process().then(() => {
//     return callback(null, resultForResnpose)
//   })
// }


module.exports = [
  {
    name: 'services.inject.lastHistory',
    method: lastHistory
  },
  // {
  //   name: 'services.inject.injectRdt',
  //   method: injectRdt
  // }
];

