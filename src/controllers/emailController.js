const { sendThanksEmail } = require("../services/emailService");
const {
  errorResponse,
  successResponse,
} = require("../utils/responseHandler.util");

exports.sendThanksEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json(errorResponse("Email address is required"));
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(errorResponse("Invalid email format"));
    }

    // Send email
    const result = await sendThanksEmail(email);

    if (result.success) {
      return res.status(200).json(
        successResponse("Thanks email sent successfully", {
          email: result.email,
          messageId: result.messageId,
        }),
      );
    } else {
      return res.status(400).json(errorResponse(result.error, result.details));
    }
  } catch (error) {
    console.error("ERROR::sendThanksEmail:", error);
    return res
      .status(500)
      .json(errorResponse("Failed to send email", error.message));
  }
};
