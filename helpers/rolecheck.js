const countByRole = (user,query) => {
    let searching
    if (user.role == 'dinkeskota') {
        searching = {
            author: user._id,
            address_district_code: query.address_district_code
        }
    } else if (user.role == 'dinkesprov' || user.role == 'superadmin') {
        searching = {}
    } else {
        searching = {}
    }
    return searching
}

module.exports = {
    countByRole
}