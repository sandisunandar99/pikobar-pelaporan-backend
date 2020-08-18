const { 
    CRITERIA 
} = require('../constant')

const {
    sum,
    sumBasedOnLocation,
    buildProject
} = require('../filter/dailyreportfilter')

const {
    addFields,
    transformFields
} = require('./transform')

const aggCaseDailyReport = (searching, dates) => {

    const match = {
        $match: {
            $and: [
                searching, { delete_status: { $ne: 'deleted' }, verified_status: 'verified'},
            ]
        }
    }
  
    const lookup = {
        $lookup: {
            from: 'histories',
            localField: '_id',
            foreignField: 'case',
            as: 'histories'
        }
    }

    const group = {
        ...sum('suspect', [
            { $eq: ['$status', CRITERIA.SUS] }
        ], dates),
        ...sum('probable', [
            { $eq: ['$status', CRITERIA.PROB] }
        ], dates),
        ...sum('suspectIsolated', [
            { $eq: ['$status', CRITERIA.SUS] },
            { $eq: ['$final_result', '4'] }
        ], dates),
        ...sum('suspectDiscarded', [
            { $eq: ['$status', CRITERIA.SUS] },
            { $eq: ['$final_result', '3'] }
        ], dates),
        ...sum('confirmed', [
            { $eq: ['$status', CRITERIA.CONF] }
        ], dates),
        ...sum('confirmedSymptomatic', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $isArray: ['$lastHis.diagnosis'] },
            { $ne: ['$lastHis.diagnosis', [] ] }
        ], dates),
        ...sum('confirmedAsymptomatic', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $in: ['$lastHis.diagnosis', [null, []] ] }
        ], dates),
        ...sum('confirmedTravel', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $or: [
                { $eq: ["$lastHis.has_visited_public_place", true] },
                { $eq: ["$lastHis.travelling_history_before_sick_14_days", true] },
                { $eq: ["$lastHis.visited_local_area_before_sick_14_days", true] }
                ]
            }
        ], dates),
        ...sum('confirmedNoTravel', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $or: [
                {$and: [
                    { $eq: ["$lastHis.has_visited_public_place", true] },
                    { $eq: ["$lastHis.travelling_history_before_sick_14_days", true] },
                    { $eq: ["$lastHis.visited_local_area_before_sick_14_days", true] }
                ]},
                { $ne: ["$close_contact", 1] }
                ]
            }
        ], dates),
        ...sum('confirmedRecovered', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $eq: ['$final_result', '1'] }
        ], dates),
        ...sum('closeContact', [
            { $eq: ['$status', CRITERIA.CLOSE] }
        ], dates),
        ...sum('closeContactNew', [
            { $eq: ['$status', CRITERIA.CLOSE] }
        ], dates),
        ...sum('closeContactSuspect', [
            { $eq: ['$status', CRITERIA.SUS] },
            { $eq: ['$prevHis.status', CRITERIA.CLOS] },
        ], dates),
        ...sum('closeContactConfirmed', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $eq: ['$prev_history.status', CRITERIA.CLOS] },
        ], dates),
        ...sum('closeContactDiscarded', [
            { $in: ['$status', [ CRITERIA.CONF, CRITERIA.CLOSE ] ] },
            { $eq: ['$final_result', '1'] },
        ], dates),
        ...sum('deceaseConfirmed', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $eq: ['$final_result', '2'] },
        ], dates),
        ...sum('deceaseProbable', [
            { $eq: ['$status', CRITERIA.PROB] },
            { $eq: ['$final_result', '2'] },
        ], dates),
        ...sum('rapidTest', [
            { $eq: ['$rapidTest', true] },
        ], dates),
        ...sum('rapidTestReactive', [
            { $eq: ['$rapidTestReactive', true] },
        ], dates),
        ...sum('pcr', [
            { $eq: ['$pcr', true] },
        ], dates),
        ...sum('pcrPositive', [
            { $eq: ['$pcrPositive', true] },
        ], dates),
        ...sumBasedOnLocation('suspectProbableIsolation', [
            { $in: [ '$status', [CRITERIA.SUS, CRITERIA.PROB] ] },
        ], dates),
        ...sumBasedOnLocation('confirmedIsolation', [
            { $eq: [ '$status', CRITERIA.CONF ] },
        ], dates),
        ...sumBasedOnLocation('closeContactIsolation', [
            { $eq: [ '$status', CRITERIA.CLOSE ] },
            { $ne: [ '$final_result', null ] },
        ], dates)
    }

    const facet = { $facet: group }

    const unwind = { $unwind: '$lastHis' }

    const attributes = Object.keys(facet.$facet).map((key) => key)
    
    const project = buildProject(attributes)

    const aggCaseQuery = [
        match,
        lookup,
        addFields,
        transformFields,
        unwind,
        facet,
        project
    ]

    return aggCaseQuery
}

module.exports = {
    aggCaseDailyReport
}
