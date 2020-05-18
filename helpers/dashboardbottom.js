const filterJson = async (ageGroup, genderGroup) => {

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
                "bawah_5":1,
                "6_19":1,
                "20_29":1,
                "30_39":1,
                "40_49":1,
                "50_59":1,
                "60_69":1,
                "70_79":1,
                "atas_80":1,
            },
            "perempuan":{
                "bawah_5":1,
                "6_19":1,
                "20_29":1,
                "30_39":1,
                "40_49":1,
                "50_59":1,
                "60_69":1,
                "70_79":1,
                "atas_80":1,
            }
        }
    }

    return respon

};

module.exports = {
    filterJson
}