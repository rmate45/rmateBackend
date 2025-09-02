const {
  saveUserResponse,
  getUserByPhone,
  getAllUsers,
  getUserDetails,
  getResponseByQuestionId,
  getUserProfile,
} = require("../services/userService");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseHandler.util");

exports.saveResponse = async (req, res) => {
  try {
    const { phoneNumber, responses } = req.body;

    if (!phoneNumber) {
      return res.status(400).json(errorResponse("Phone number is required"));
    }

    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json(errorResponse("Responses array is required"));
    }

    // Basic validation
    for (const response of responses) {
      if (!response.questionId || response.answer === undefined) {
        return res
          .status(400)
          .json(errorResponse("Each response must have questionId and answer"));
      }
    }

    const result = await saveUserResponse(phoneNumber, responses);

    return res.status(200).json(
      successResponse(
        result.completed
          ? "User response saved successfully"
          : "Partial response saved successfully",
        {
          phoneNumber: result.phoneNumber,
          responseCount: result.responses.length,
          completed: result.completed,
        }
      )
    );
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(errorResponse("Failed to save responses", error.message));
  }
};

exports.getUser = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const user = await getUserByPhone(phoneNumber);

    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }

    return res
      .status(200)
      .json(successResponse("User retrieved successfully", user));
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(errorResponse("Failed to fetch user", error.message));
  }
};

exports.getResponse = async (req, res) => {
  try {
    const { phoneNumber, questionId } = req.params;
    const response = await getResponseByQuestionId(phoneNumber, questionId);

    if (!response) {
      return res
        .status(404)
        .json(errorResponse("Response not found for this question"));
    }

    return res
      .status(200)
      .json(successResponse("Response retrieved successfully", response));
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(errorResponse("Failed to fetch response", error.message));
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const profile = await getUserProfile(phoneNumber);

    if (!profile) {
      return res.status(404).json(errorResponse("User not found"));
    }

    return res
      .status(200)
      .json(successResponse("User profile retrieved successfully", profile));
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(errorResponse("Failed to fetch profile", error.message));
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Support dynamic filtering
    const filters = {
      name: req.query.name,
      zipCode: req.query.zipCode,
      age: req.query.age,
      // Add more filters as needed
    };

    const result = await getAllUsers(filters, page, limit);

    return res
      .status(200)
      .json(successResponse("Users retrieved successfully", result));
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(errorResponse("Failed to fetch users", error.message));
  }
};

exports.getRetirementPlan = async (req, res) => {
  try {
    const { phoneNumber, planId } = req.params;

    const user = await getUserByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }

    const plan = user.retirementPlans.find((p) => p.planId === planId);
    if (!plan) {
      return res.status(404).json(errorResponse("Plan not found"));
    }

    if (plan.status !== "generated") {
      return res.status(202).json(
        successResponse("Plan is still being generated", {
          status: plan.status,
          estimatedWaitTime: "2-3 minutes",
        })
      );
    }

    // Set HTML content type and send the plan
    res.setHeader("Content-Type", "text/html");
    res.send(plan.htmlContent);
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(errorResponse("Failed to retrieve retirement plan", error.message));
  }
};
