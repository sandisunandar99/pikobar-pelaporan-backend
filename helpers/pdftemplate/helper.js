const transformAge = (data) => {
  if (data.birth_date) {
    age = moment().diff(data.birth_date, 'years')
    ageInMonths = moment().diff(data.birth_date, 'months')
  } else {
    age = parseInt(data.age) || 0
    ageInMonths = Math.round((Number(data.age) - age) * 12)
  }

  const tramsformed = {
    age: age,
    ageInMonths: ageInMonths < 12 ? ageInMonths : ageInMonths%12
  }

  return tramsformed
}

module.exports = {
  transformAge,
}
