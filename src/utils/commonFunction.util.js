const twilio = require('twilio');
const config = require('../config/env.config');

const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

const sendTwilioSms = async (msg,mobile_number) => {
    try {
        const message = await client.messages.create({
            body: msg,
            from: config.TWILIO_PHONE_NUMBER,
            to: mobile_number,
        });
        return { success: true, message };
    } catch (error) {
        console.error('Error sending SMS:', error);
        return { success: false, error };
    }
};

module.exports = {
    sendTwilioSms
}