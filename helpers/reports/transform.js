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
 * Firstly, inspection_support is an array of objects fields
 * Daily report need to calculate inspection_support based on child field (type, result)
 * the problem is, we need to sum it only if, the array of inspection_supprt(type/result) has specified one match
 * so, the quick solve problem to transform an array of objects to a single needed informative value that is boolean  
 */
const transformFields = {
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

module.exports = {
    addFields,
    transformFields
}
