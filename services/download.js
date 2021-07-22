const { readFileFromBucket } = require('../config/aws')

const downloadData = async (query, callback) => {
  try {
    const res = await readFileFromBucket(query.bucket, query.file)
    callback(null, res)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.download.downloadData',
    method: downloadData
  },
]
