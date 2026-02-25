require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.DATABASE_URL,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  FRONTEND_URL: process.env.FRONTEND_URL,
  aws: {
    region: process.env.AWS_REGION || "us-east-2",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  ses: {
    fromEmail: process.env.SES_FROM_EMAIL || "welcome@retiremate.com",
    replyTo: process.env.SES_REPLY_TO || "contact@retiremate.com",
  },
};
