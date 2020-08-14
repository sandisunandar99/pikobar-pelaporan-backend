const filter = (params, gte, lt) => {
    let dateRange = []
    if (gte && lt) {
        dateRange = [
            { $gte: ["$last_history.createdAt", new Date(gte) ] },
            { $lt: ["$last_history.createdAt", new Date(lt) ] }
        ]
    }

    return {
        $sum: {
            $cond: [
              {
                $and: [
                  ...params,
                  ...dateRange
                ]
              }, 1, 0]
          }
    }
}

const sum = (params, d) => {
    return {
        aDay: filter(params, d.aDay, d.aDueDay),
        aWeek: filter(params, d.aWeek, d.aDueDay),
        aMonth: filter(params, d.aMonth, d.aDueDay),
    }
}

const sumBasedOnLocation = (params, d) => {
    const aDay = [d.aDay, d.aDueDay]
    const loc = (v) => Object.assign({}, { '$eq': [ '$last_history.current_location_type', v ] })

    return {
        referralHospital: filter([ ...params, loc('RS') ], ...aDay),
        emergencyHospital: filter([ ...params, loc('RS') ], ...aDay),
        selfIsolation: filter([ ...params, loc('RUMAH') ], ...aDay),
    }
}

const buildProject = (fields) => {
    let project = {}

    for (let i in fields) {
        
        const field = fields[i]

        project[field] = {
            $cond: [ 
                { $eq: [ { "$size": `$${field}` }, 0 ] }, 
                { $literal: null }, 
                { $arrayElemAt: [ `$${field}`, 0 ] }
            ]
        }
    }

    return { "$project": project }
}

module.exports = {
    sum,
    sumBasedOnLocation,
    buildProject,
}
