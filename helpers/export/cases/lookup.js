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

module.exports = {
  histories, author
}