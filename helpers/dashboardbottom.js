const filterJson = async (ageGroupMale, ageGroupFemale, genderGroup) => {

    const countGroupGender = genderGroup.reduce((obj, item) => (
        obj[item._id] = item.total, obj) 
    ,{});

    let respon = {
        chart_by_gender: {
            "L": (countGroupGender.L ? countGroupGender.L : 0),
            "P": (countGroupGender.P ? countGroupGender.P : 0),
        },
        chart_by_age: {
            "laki_laki":{
                ageGroupMale
            },
            "perempuan":{
                ageGroupFemale
            }
        }
    }

    return respon

};

module.exports = {
    filterJson
}