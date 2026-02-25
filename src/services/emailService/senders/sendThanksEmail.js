const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("../sesClient");
const { createThanksEmailParams } = require("../templates/thanksEmail");

const sendThanksEmail = async (userEmail) => {
  try {
    // Validate email
    if (!userEmail || !userEmail.includes("@")) {
      throw new Error("Valid email address is required");
    }

    // Create email parameters
    const params = createThanksEmailParams(userEmail);

    // Create and send email command
    const sendEmailCommand = new SendEmailCommand(params);
    const response = await sesClient.send(sendEmailCommand);

    console.log(
      `Thanks email sent to ${userEmail}. Message ID: ${response.MessageId}`,
    );

    return {
      success: true,
      messageId: response.MessageId,
      email: userEmail,
    };
  } catch (error) {
    console.error(`Failed to send thanks email to ${userEmail}:`, error);

    // Handle specific SES errors
    if (error.name === "MessageRejected") {
      return {
        success: false,
        error:
          "Email rejected by SES. Check if recipient is verified (if in sandbox).",
        details: error.message,
      };
    }

    if (error.name === "MailFromDomainNotVerifiedException") {
      return {
        success: false,
        error: "MAIL FROM domain is not verified.",
        details: error.message,
      };
    }

    throw error;
  }
};

module.exports = { sendThanksEmail };
