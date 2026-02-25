const { SESClient } = require("@aws-sdk/client-ses");
const config = require("../../config/env.config");

const sesClient = new SESClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

module.exports = { sesClient };
