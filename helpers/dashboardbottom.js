const filterJson = async (ageGroup, genderGroup) => {
    const countGroupAge = ageGroup.reduce((obj, item) => 
    (
        obj[`age_${item._id}`] = item.total, 
        obj[`age_male_${item._id}`] = item.male,
        obj[`age_female_${item._id}`] = item.female, obj) 
    ,{});

    const countGroupGender = genderGroup.reduce((obj, item) => (
        obj[item._id] = item.total, obj) 
    ,{});

    const defineKey = {
      "L": (countGroupGender.L ? countGroupGender.L : 0),
      "P": (countGroupGender.P ? countGroupGender.P : 0),
      "age_0": (countGroupAge.age_0 ? countGroupAge.age_0 : 0),
      "age_male_0": (countGroupAge.age_male_0 ? countGroupAge.age_male_0 : 0),
      "age_female_0": (countGroupAge.age_female_0 ? countGroupAge.age_female_0 : 0),
      "age_10": (countGroupAge.age_10 ? countGroupAge.age_10 : 0),
      "age_male_10": (countGroupAge.age_male_10 ? countGroupAge.age_male_10 : 0),
      "age_female_10": (countGroupAge.age_female_10 ? countGroupAge.age_female_10 : 0),
      "age_20": (countGroupAge.age_20 ? countGroupAge.age_20 : 0),
      "age_male_20": (countGroupAge.age_male_20 ? countGroupAge.age_male_20 : 0),
      "age_female_20": (countGroupAge.age_female_20 ? countGroupAge.age_female_20 : 0),
      "age_30": (countGroupAge.age_30 ? countGroupAge.age_30 : 0),
      "age_male_30": (countGroupAge.age_male_30 ? countGroupAge.age_male_30 : 0),
      "age_female_30": (countGroupAge.age_female_30 ? countGroupAge.age_female_30 : 0),
      "age_40": (countGroupAge.age_40 ? countGroupAge.age_40 : 0),
      "age_male_40": (countGroupAge.age_male_40 ? countGroupAge.age_male_40 : 0),
      "age_female_40": (countGroupAge.age_female_40 ? countGroupAge.age_female_40 : 0),
      "age_50": (countGroupAge.age_50 ? countGroupAge.age_50 : 0),
      "age_male_50": (countGroupAge.age_male_50 ? countGroupAge.age_male_50 : 0),
      "age_female_50": (countGroupAge.age_female_50 ? countGroupAge.age_female_50 : 0),
      "age_60": (countGroupAge.age_60 ? countGroupAge.age_60 : 0),
      "age_male_60": (countGroupAge.age_male_60 ? countGroupAge.age_male_60 : 0),
      "age_female_60": (countGroupAge.age_female_60 ? countGroupAge.age_female_60 : 0),
      "age_70": (countGroupAge.age_70 ? countGroupAge.age_70 : 0),
      "age_male_70": (countGroupAge.age_male_70 ? countGroupAge.age_male_70 : 0),
      "age_female_70": (countGroupAge.age_female_70 ? countGroupAge.age_female_70 : 0),
      "age_80": (countGroupAge.age_80 ? countGroupAge.age_80 : 0),
      "age_male_80": (countGroupAge.age_male_80 ? countGroupAge.age_male_80 : 0),
      "age_female_80": (countGroupAge.age_female_80 ? countGroupAge.age_female_80 : 0),
      "age_90": (countGroupAge.age_90 ? countGroupAge.age_90 : 0),
      "age_male_90": (countGroupAge.age_male_90 ? countGroupAge.age_male_90 : 0),
      "age_female_90": (countGroupAge.age_female_90 ? countGroupAge.age_female_90 : 0),
      "age_100": (countGroupAge.age_100 ? countGroupAge.age_100 : 0),
      "age_male_100": (countGroupAge.age_male_100 ? countGroupAge.age_male_100 : 0),
      "age_female_100": (countGroupAge.age_female_100 ? countGroupAge.age_female_100 : 0),
    };

    // jika ingin dipisah
    let respon = {
        chart_by_gender: countGroupGender,
        chart_by_age: defineKey
    }

    return Object.assign(countGroupGender, defineKey)

};

module.exports = {
    filterJson
}