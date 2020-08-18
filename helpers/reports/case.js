const { 
    CRITERIA 
} = require('../constant')

const {
    sum,
    sumBasedOnLocation,
    buildProject
} = require('../filter/dailyreportfilter')

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

    const addFields = {
        $addFields: {
            last_history: { $arrayElemAt: [ `$histories`, 0 ] },
            prev_history: {
                $cond: [ 
                    { $lt: [ { "$size": `$histories` }, 2 ] }, 
                    { $literal: null }, 
                    { $arrayElemAt: [ `$histories`, 1 ] }
                ]
            }
        }
    }

    const group = {
        "$facet": {
            'suspect': [{
                $group: {
                    _id: 'suspect',
                    ...sum([{ $eq: ['$status', CRITERIA.SUS] }], dates)
                }
            }],
            'probable': [{
                $group: {
                    _id: 'probable',
                    ...sum([{ $eq: ['$status', CRITERIA.PROB] }], dates)
                }
            }],
            'suspectIsolated': [{
                $group: {
                    _id: 'suspectIsolated',
                    ...sum([
                        { $eq: ['$status', CRITERIA.SUS] },
                        { $eq: ['$final_result', '4'] }
                    ], dates)
                }
            }],
            'suspectDiscarded': [{
                $group: {
                    _id: 'suspectDiscarded',
                    ...sum([
                        { $eq: ['$status', CRITERIA.SUS] },
                        { $eq: ['$final_result', '3'] }
                    ], dates)
                }
            }],
            'confirmed': [{
                $group: {
                    _id: 'confirmed',
                    ...sum([{ $eq: ['$status', CRITERIA.CONF] }], dates)
                }
            }],
            'confirmedSymptomatic': [{
                $group: {
                    _id: 'confirmedSymptomatic',
                    ...sum([
                        { $eq: ['$status', CRITERIA.CONF] },
                        { $isArray: ['$last_history.diagnosis'] },
                        { $ne: ['$last_history.diagnosis', [] ] }
                    ], dates)
                }
            }],
            'confirmedAsymptomatic': [{
                $group: {
                    _id: 'confirmedAsymptomatic',
                    ...sum([
                        { $eq: ['$status', CRITERIA.CONF] },
                        { $in: ['$last_history.diagnosis', [null, []] ] }
                    ], dates)
                }
            }],
            'confirmedTravel': [{
                $group: {
                    _id: 'confirmedTravel',
                    ...sum([
                        { $eq: ['$status', CRITERIA.CONF] },
                        { $or: [
                            { $eq: ["$last_history.has_visited_public_place", true] },
                            { $eq: ["$last_history.travelling_history_before_sick_14_days", true] },
                            { $eq: ["$last_history.visited_local_area_before_sick_14_days", true] }
                          ]
                        }
                    ], dates)
                }
            }],
            'confirmedNoTravel': [{
                $group: {
                    _id: 'confirmedNoTravel',
                    ...sum([
                        { $eq: ['$status', CRITERIA.CONF] },
                        { $or: [
                            {$and: [
                                { $eq: ["$last_history.has_visited_public_place", true] },
                                { $eq: ["$last_history.travelling_history_before_sick_14_days", true] },
                                { $eq: ["$last_history.visited_local_area_before_sick_14_days", true] }
                            ]},
                            { $ne: ["$close_contact", 1] }
                          ]
                        }
                    ], dates)
                }
            }],
            'confirmedRecovered': [{
                $group: {
                    _id: 'confirmedRecovered',
                    ...sum([
                        { $eq: ['$status', CRITERIA.CONF] },
                        { $eq: ['$final_result', '1'] }
                    ], dates)
                }
            }],
            'closeContact': [{
                $group: {
                    _id: 'suspect',
                    ...sum([{ $eq: ['$status', CRITERIA.CLOSE] }], dates)
                }
            }],
            'closeContactNew': [{
                $group: {
                    _id: 'suspect',
                    ...sum([{ $eq: ['$status', CRITERIA.CLOSE] }], dates)
                }
            }],
            'closeContactSuspect': [{
                $group: {
                    _id: 'suspect',
                    ...sum([
                        { $eq: ['$status', CRITERIA.SUS] },
                        { $eq: ['$prev_history.status', CRITERIA.CLOS] },
                    ], dates)
                }
            }],
            'closeContactConfirmed': [{
                $group: {
                    _id: 'suspect',
                    ...sum([
                        { $eq: ['$status', CRITERIA.CONF] },
                        { $eq: ['$prev_history.status', CRITERIA.CLOS] },
                    ], dates)
                }
            }],
            'closeContactDiscarded': [{
                $group: {
                    _id: 'suspect',
                    ...sum([
                        { $in: ['$status', [ CRITERIA.CONF, CRITERIA.CLOSE ] ] },
                        { $eq: ['$final_result', '1'] },
                    ], dates)
                }
            }],
            'deceaseConfirmed': [
            {
                $group: {
                    _id: 'decease',
                    ...sum([
                        { $eq: ['$status', CRITERIA.CONF] },
                        { $eq: ['$final_result', '2'] },
                    ], dates)
                }
            }
            ],
            'deceaseProbable': [{
                $group: {
                    _id: 'decease',
                    ...sum([
                        { $eq: ['$status', CRITERIA.PROB] },
                        { $eq: ['$final_result', '2'] },
                    ], dates)
                }
            }],
            'suspectProbableIsolation': [{
                $group: {
                    _id: 'emergencyHospitalIsolation',
                    ...sumBasedOnLocation([
                        { $in: [ '$status', [CRITERIA.SUS, CRITERIA.PROB] ] },
                    ], dates)
                }
            }],
            'confirmedIsolation': [{
                $group: {
                    _id: 'emergencyHospitalIsolation',
                    ...sumBasedOnLocation([
                        { $eq: [ '$status', CRITERIA.CONF ] },
                    ], dates)
                }
            }],
            'closeContactIsolation': [{
                $group: {
                    _id: 'closeContactIsolation',
                    ...sumBasedOnLocation([
                        { $eq: [ '$status', CRITERIA.CLOSE ] },
                        { $ne: [ '$final_result', null ] },
                    ], dates)
                }
            }],
        }
    }

    const unwind = { $unwind: '$last_history' }

    const attributes = Object.keys(group.$facet).map((key) => key)
    const project = buildProject(attributes)

    const aggCaseQuery = [
        match,
        lookup,
        addFields,
        unwind,
        group,
        project
    ]

    return aggCaseQuery
}

module.exports = {
    aggCaseDailyReport
}
