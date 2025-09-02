const UserResponseModel = require('../models/UserResponse');

// Configuration - can be moved to config file or database
const CONFIG = {
  requiredQuestions: ['Q1', 'Q2', 'Q3'], // Minimum questions to consider complete
  metadataMappings: {
    // Define which questions should be extracted to metadata for easy querying
    'Q1': 'name',
    'Q3': 'age',
    'Q7': 'zipCode',
    'Q9': 'annualIncome',
    'Q10': 'retirementSavings'
  }
};

const saveUserResponse = async (phoneNumber, responses) => {
  try {
    const metadata = new Map();
    const allResponses = [];

    // Process each response
    responses.forEach(response => {
      allResponses.push({
        questionId: response.questionId,
        answer: response.answer
      });

      // Automatically extract to metadata if configured
      if (CONFIG.metadataMappings[response.questionId]) {
        const fieldName = CONFIG.metadataMappings[response.questionId];
        metadata.set(fieldName, response.answer);
      }
    });

    // Check completion based on required questions
    const answeredQuestionIds = responses.map(r => r.questionId);
    const hasRequiredAnswers = CONFIG.requiredQuestions.every(q => 
      answeredQuestionIds.includes(q)
    );

    const updateData = {
      phoneNumber,
      responses: allResponses,
      metadata: Object.fromEntries(metadata),
      completed: hasRequiredAnswers,
      updatedAt: new Date()
    };

    // Update or create user response
    const result = await UserResponseModel.findOneAndUpdate(
      { phoneNumber },
      updateData,
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    );

    return result;
  } catch (error) {
    console.error("Error saving user response:", error);
    throw error;
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
      { phoneNumber, 'responses.questionId': questionId },
      { 'responses.$': 1 }
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
      lastUpdated: user.updatedAt
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
    Object.keys(filters).forEach(key => {
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
        hasPrev: page > 1
      }
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
};