const sumFunc = (criteria) => {
  return {
    $sum: {
      $cond: [
        {
          $and: [
            { $eq: ["$status", criteria.CONF] }
          ],
        }, 1, 0]
    }
  }
}

module.exports = {
  sumFunc
}