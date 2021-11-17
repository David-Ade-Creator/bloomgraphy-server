const config = require("../../config");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3")

module.exports = {
  Mutation: {
    signS3: async (parent, { filename, filetype }) => {
      aws.config.update({
        accessKeyId: config.ACCESSBUCKETKEY,
        secretAccessKey: config.SECRETACCESSBUCKETKEY,
      });
      const s3 = new aws.S3(
        {
            signatureVersion: 'v4',
            region: 'us-east-2',
          }
      );

      const s3Params = {
        Bucket: config.s3Bucket,
        Key: filename,
        Expires: 60,
        ContentType: "image/png",
        ACL: "public-read",
      };

      const signedRequest = await s3.getSignedUrl("putObject", s3Params);
      const url = `https://${config.s3Bucket}.s3.amazonaws.com/${filename}`;

      return {
        signedRequest,
        url,
      };
    },
  },
};
