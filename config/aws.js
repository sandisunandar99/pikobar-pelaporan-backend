const AWS = require('aws-sdk')

// Initializing S3 Interface
const awsBucket = new AWS.S3({
  accessKeyId: process.env.AWS_BUCKET_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

const uploadFileToAwsBucket = (fileName, fileContent, bucketName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent
  };

  // Uploading files to the bucket
  awsBucket.upload(params, function (err, data) {
    if (err) {
      throw err
    }
  });
};

const readFileFromBucket = async (bucketName, fileName) => {
  return await awsBucket.getObject({ Bucket: bucketName, Key: fileName }).promise()
}

const getSingedUrl = async (bucketName, fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: 7200 // expire in 2 hours
  };
  try {
    const url = await new Promise((resolve, reject) => {
      awsBucket.getSignedUrl('getObject', params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    });
    return url
  } catch (err) {
    if (err) {
      console.log(err)
    }
  }
}

module.exports = {
  uploadFileToAwsBucket, readFileFromBucket, getSingedUrl
}