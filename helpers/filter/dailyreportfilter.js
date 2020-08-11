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
        aWeek: filter(params, d.aWeek, d.aDay),
        aMonth: filter(params, d.aMonth, d.aDay),
    }
}

const sumBasedOnLocation = (params, d) => {
    const referralHosp = { '$eq': [ '$last_history.current_location_type', 'RS' ] }
    const emergencyHosp = { '$eq': [ '$last_history.current_location_type', 'RS' ] }
    const selfIsolation = { '$eq': [ '$last_history.current_location_type', 'RUMAH' ] }

    return {
        referralHospital: filter([ ...params, referralHosp ]),
        emergencyHospital: filter([ ...params, emergencyHosp ]),
        selfIsolation: filter([ ...params, selfIsolation ]),
    }
}

module.exports = {
    sum,
    sumBasedOnLocation
}
