const histories = {
  $lookup: {
    from: "histories",
    localField: "last_history",
    foreignField: "_id",
    as: "history_list"
  }
}

const author = {
  $lookup: {
    from: "users",
    localField: "author",
    foreignField: "_id",
    as: "author_list"
  }
}

const casesHistory = {
  $lookup: {
    from: "histories",
    localField: "_id",
    foreignField: "case",
    as: "histories"
  }
}

module.exports = {
  histories, author, casesHistory
}