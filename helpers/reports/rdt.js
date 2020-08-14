const {
    sum,
    buildProject
} = require('../filter/dailyreportfilter')

const aggRdtDailyReport = (searching, dates) => {

    const match = {
        $match: {
            $and: [
                searching, { status: { $ne: 'deleted' } },
            ]
        }
    }

    const lookup = {
        $lookup: {
            from: 'rdthistories',
            localField: 'last_history',
            foreignField: '_id',
            as: 'last_history'
        }
    }
  
    const group = {
        "$facet": {
            'rapidTest': [{
                $group: {
                    _id: 'rapidTest',
                    ...sum([
                        searching,
                        { $ne: [ '$status', 'deleted' ] },
                    ], dates)
                }
            }]
        }
    }

    const unwind = { $unwind: '$last_history' }

    const project = buildProject([
        "rapidTest"
    ])

    const aggRdtQuery = [
        match,
        lookup,
        unwind,
        group,
        project
    ]

    return aggRdtQuery
}

module.exports = {
    aggRdtDailyReport
}
