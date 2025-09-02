require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.DATABASE_URL,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  FRONTEND_URL: process.env.FRONTEND_URL,
};
