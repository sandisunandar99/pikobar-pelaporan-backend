const addFields = {
  $addFields: {
    lastHis: { $arrayElemAt: [ `$histories`, 0 ] },
    prevhis: {
      $cond: [
        { $lt: [ { "$size": `$histories` }, 2 ] },
        { $literal: null },
        { $arrayElemAt: [ `$histories`, 1 ] }
      ]
    }
  }
}

/*
 * Why using transformer?
 * Firstly, "inspection_support" is an array of objects fields
 * Daily report need to calculate inspection_support based on child field of an array of objects (type/result)
 * the problem is, we just need to sum it, only if the array of inspection_supprt(type/result) has specified one match
 * so, the quick solve problem to transform an array of objects to a single needed informative value that's boolean
 */
const transformedFields = {
  $addFields: {
    rapidTest: { $toBool: {
      $arrayElemAt: [{
        $filter: {
          input: "$lastHis.inspection_support",
          as: "item",
          cond: { $eq: [ "$$item.inspection_type", "other_checks" ] }
        }
      }, 0]
    } },
    rapidTestReactive: { $toBool: {
      $arrayElemAt: [{
        $filter: {
          input: "$lastHis.inspection_support",
          as: "item",
          cond: { $and:[
            { $eq: [ "$$item.inspection_type", "other_checks" ] },
            /*founded typo value in DB, it should be reactive*/
            { $eq: [ "$$item.inspection_result", "reactif" ] }
          ] }
        }
      }, 0]
    } },
    pcr: { $toBool: {
        $arrayElemAt: [{
          $filter: {
            input: "$lastHis.inspection_support",
            as: "item",
            cond: { $eq: [ "$$item.inspection_type", "lab_confirm" ] }
          }
        }, 0]
    } },
    pcrPositive: { $toBool: {
      $arrayElemAt: [{
        $filter: {
            input: "$lastHis.inspection_support",
            as: "item",
            cond: { $and:[
                { $eq: [ "$$item.inspection_type", "lab_confirm" ] },
                { $eq: [ "$$item.inspection_result", "positif" ] }
            ] }
        }
      }, 0]
    } },
  }
}

/*
 * Transformer func for json2xls param
 * @param {object} docs
 */
const transformedXlsFor = (docs) => {
  let res = []
  const lang = require('../constant')['DAILY_REPORT']

  for (i in docs) {
    const v = docs[i]
    const prop = (v._id.replace(/[A-Z]/g, v => `_${v}`)).toUpperCase()

    if (v.hasOwnProperty('aDay')) {
      res.push({
        status: lang[prop],
        [lang.DAY]: v.aDay,
        [lang.WEEK]: v.aWeek,
        [lang.MONTH]: v.aMonth
      })
    } else {
      res.push({
        status: lang[prop],
        referralHospital: v.referralHospital,
        emergencyHospital: v.emergencyHospital,
        selfIsolation: v.selfIsolation
      })
    }
  }

  return res
}

module.exports = {
    addFields,
    transformedFields,
    transformedXlsFor
}
