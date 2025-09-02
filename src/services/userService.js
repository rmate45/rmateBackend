const UserResponseModel = require("../models/UserResponse");
const { sendTwilioSms } = require("../utils/commonFunction.util");
const config = require("../config/env.config");
const chatService = require("../services/chatService");
const { v4: uuidv4 } = require("uuid");

// Configuration - can be moved to config file or database
const CONFIG = {
  requiredQuestions: ["Q1", "Q2", "Q3"], // Minimum questions to consider complete
  metadataMappings: {
    // Define which questions should be extracted to metadata for easy querying
    Q1: "name",
    Q3: "age",
    Q7: "zipCode",
    Q9: "annualIncome",
    Q10: "retirementSavings",
  },
};

const saveUserResponse = async (phoneNumber, responses) => {
  try {
    const metadata = new Map();
    const allResponses = [];

    responses.forEach((response) => {
      allResponses.push({
        questionId: response.questionId,
        answer: response.answer,
      });

      if (CONFIG.metadataMappings[response.questionId]) {
        const fieldName = CONFIG.metadataMappings[response.questionId];
        metadata.set(fieldName, response.answer);
      }
    });

    const answeredQuestionIds = responses.map((r) => r.questionId);
    const hasRequiredAnswers = CONFIG.requiredQuestions.every((q) =>
      answeredQuestionIds.includes(q)
    );

    const updateData = {
      phoneNumber,
      responses: allResponses,
      metadata: Object.fromEntries(metadata),
      completed: hasRequiredAnswers,
      updatedAt: new Date(),
    };

    const result = await UserResponseModel.findOneAndUpdate(
      { phoneNumber },
      updateData,
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    // If user just completed the quiz, trigger parallel processes
    if (hasRequiredAnswers && result.completed) {
      triggerPostCompletionProcesses(phoneNumber, result.metadata);
    }

    return result;
  } catch (error) {
    console.error("Error saving user response:", error);
    throw error;
  }
};

const triggerPostCompletionProcesses = async (phoneNumber, metadata) => {
  const obj = Object.fromEntries(metadata);
  try {
    // 1. Send welcome message via Twilio (non-blocking)
    sendWelcomeMessage(phoneNumber, obj.name);

    // 2. Generate retirement plan (non-blocking)
    generateRetirementPlan(phoneNumber, obj);
  } catch (error) {
    console.error("Error in post-completion processes:", error);
  }
};

const sendWelcomeMessage = async (phoneNumber, userName) => {
  try {
    const welcomeMessage = `Welcome to RetireMate, ${
      userName || "Valued Customer"
    }! Your personalized retirement plan is being created. We'll send you the link shortly.`;

    const result = await sendTwilioSms(welcomeMessage, phoneNumber);
    if (result.success) {
      console.log(`Welcome SMS sent to ${phoneNumber}`);
    } else {
      console.error(
        `Failed to send welcome SMS to ${phoneNumber}:`,
        result.error
      );
    }
  } catch (error) {
    console.error("Error sending welcome message:", error);
  }
};

const generateRetirementPlan = async (phoneNumber, metadata) => {
  try {
    const planId = uuidv4();
    // Update plan status to pending
    await UserResponseModel.findOneAndUpdate(
      { phoneNumber },
      {
        $push: {
          retirementPlans: {
            planId: planId,
            status: "pending",
          },
        },
      }
    );

    // Generate the AI prompt with candidate details
    const aiPrompt = buildRetirementPlanPrompt(metadata);
    console.log("aiPrompt---", aiPrompt);
    // Generate plan via AI (non-blocking)
    generatePlanWithAI(phoneNumber, planId, aiPrompt);
  } catch (error) {
    console.error("Error initiating retirement plan generation:", error);
    await updatePlanStatus(phoneNumber, planId, "failed");
  }
};

const buildRetirementPlanPrompt = (metadata) => {
  return `For the candidate described below, Please generate a detailed, multi-page RetireMate™ Retirement Plan using the theme "Planning for Future."
  Structure the plan around these six key questions, each as its own titled section:
  1. What does the current financial situation look like?
  2. Will I have enough to retire at 67 and live to 95?
  3. Will my family be financially secure if something happens?
  4. What if financial assumptions change?
  5. What actions can I take today?
  6. What about business or other financial priorities?
  
  Also include:
  - A section titled "Social Security – Impact on Retirement" with benefit estimates, pros/cons of timing, and a strategy.
  - A section titled "Tax Planning Strategies" with guidance on 401(k), Roth conversions, RMDs, withdrawal sequencing, and capital gains strategies.
  - A final summary table of personalized recommendations by category.
  
  Use guidance and language from credible financial sources including CFP Board, Fidelity, Vanguard, Suze Orman, and SSA publications.
  Fit the format and tone for presentation in HTML.
  
  Candidate Details:
  Name: ${metadata.name || "Not provided"}
  Age: ${metadata.age || "Not provided"}
  Zip Code: ${metadata.zipCode || "Not provided"}
  Current Retirement Savings: ${metadata.retirementSavings || "Not provided"}
  Annual Household Income: ${metadata.annualIncome || "Not provided"}
  
  Please generate a comprehensive HTML retirement plan.`;
};

const generatePlanWithAI = async (phoneNumber, planId, prompt) => {
  try {
    // Use your existing chat service to generate the plan
    const aiResponse = await chatService.generateRetirementPlan(prompt);

    if (aiResponse && aiResponse.content) {
      // Save the generated HTML plan
      await saveGeneratedPlan(phoneNumber, planId, aiResponse.content);

      // Send the plan link via SMS
      await sendPlanLinkSMS(phoneNumber, planId);
    } else {
      throw new Error("AI response was empty");
    }
  } catch (error) {
    console.error("Error generating retirement plan with AI:", error);
    await updatePlanStatus(phoneNumber, planId, "failed");
  }
};

const saveGeneratedPlan = async (phoneNumber, planId, htmlContent) => {
  try {
    await UserResponseModel.findOneAndUpdate(
      { phoneNumber, "retirementPlans.planId": planId },
      {
        $set: {
          "retirementPlans.$.htmlContent": htmlContent,
          "retirementPlans.$.status": "generated",
          "retirementPlans.$.generatedAt": new Date(),
        },
      }
    );
    console.log(`Retirement plan saved for ${phoneNumber}`);
  } catch (error) {
    console.error("Error saving generated plan:", error);
    throw error;
  }
};

const sendPlanLinkSMS = async (phoneNumber, planId) => {
  try {
    const planLink = `${config.FRONTEND_URL}/plans/${encodeURIComponent(
      phoneNumber
    )}/${planId}`;
    const message = `Your personalized RetireMate retirement plan is ready! View it here: ${planLink}`;

    const result = await sendTwilioSms(message, phoneNumber);
    if (result.success) {
      console.log(`Plan link SMS sent to ${phoneNumber}`);
    } else {
      console.error(
        `Failed to send plan link SMS to ${phoneNumber}:`,
        result.error
      );
    }
  } catch (error) {
    console.error("Error sending plan link SMS:", error);
  }
};

const updatePlanStatus = async (phoneNumber, planId, status) => {
  try {
    await UserResponseModel.findOneAndUpdate(
      { phoneNumber, "retirementPlans.planId": planId },
      {
        $set: {
          "retirementPlans.$.status": status,
        },
      }
    );
  } catch (error) {
    console.error("Error updating plan status:", error);
  }
};

const getUserByPhone = async (phoneNumber) => {
  try {
    return await UserResponseModel.findOne({ phoneNumber });
  } catch (error) {
    console.error("Error fetching user by phone:", error);
    throw error;
  }
};

const getResponseByQuestionId = async (phoneNumber, questionId) => {
  try {
    const user = await UserResponseModel.findOne(
      { phoneNumber, "responses.questionId": questionId },
      { "responses.$": 1 }
    );

    return user ? user.responses[0] : null;
  } catch (error) {
    console.error("Error fetching response by question ID:", error);
    throw error;
  }
};

const getUserProfile = async (phoneNumber) => {
  try {
    const user = await UserResponseModel.findOne({ phoneNumber });
    if (!user) return null;

    // Build profile from metadata and responses
    const profile = {
      phoneNumber: user.phoneNumber,
      completed: user.completed,
      lastUpdated: user.updatedAt,
    };

    // Add metadata fields
    if (user.metadata) {
      Object.assign(profile, user.metadata);
    }

    // You can add any additional processing here
    return profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

const getAllUsers = async (filters = {}, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const query = { completed: true };

    // Add dynamic filters based on metadata
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        query[`metadata.${key}`] = filters[key];
      }
    });

    const users = await UserResponseModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await UserResponseModel.countDocuments(query);

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

module.exports = {
  saveUserResponse,
  getUserByPhone,
  getResponseByQuestionId,
  getUserProfile,
  getAllUsers,
  triggerPostCompletionProcesses,
  sendWelcomeMessage,
  generateRetirementPlan,
  buildRetirementPlanPrompt,
  generatePlanWithAI,
  saveGeneratedPlan,
  sendPlanLinkSMS,
  updatePlanStatus,
};
