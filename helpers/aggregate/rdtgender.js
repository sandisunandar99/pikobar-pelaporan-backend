const { searching, rdtFilter } = require("./func/filter")

const conditionGender = async (query, user) => {
  const search = await searching(query, user)
  const filter = rdtFilter(query)
  const conditions = [
    {
      $match: {
        $and: [search, { ...filter }]
      }
    },
    {
      $group: {
        _id: 'gender',
        male: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$gender', 'L'] },
                ]
              }, 1, 0]
          }
        },
        female: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$gender', 'P'] },
                ]
              }, 1, 0]
          }
        },
      },
    }, { $project: { _id: 0 } }
  ]
  return conditions
}

module.exports = {
  conditionGender
}