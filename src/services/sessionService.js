const SessionInfo = require("../models/SessionInfo");
const { v4: uuidv4 } = require("uuid");

/**
 * Create a new session
 */
const createSession = async () => {
  try {
    const sessionId = uuidv4();

    const session = new SessionInfo({
      sessionId,
      sessionStartTimestamp: new Date(),
      status: "in_progress",
      answers: [],
    });

    await session.save();

    return {
      sessionId: session.sessionId,
      sessionStartTimestamp: session.sessionStartTimestamp,
      status: session.status,
    };
  } catch (error) {
    console.error("Error in createSession:", error);
    throw error;
  }
};

/**
 * Get session by ID
 */
const getSession = async (sessionId) => {
  try {
    const session = await SessionInfo.findOne({ sessionId });

    if (!session) {
      return null;
    }

    return {
      sessionId: session.sessionId,
      sessionStartTimestamp: session.sessionStartTimestamp,
      sessionEndTimestamp: session.sessionEndTimestamp,
      status: session.status,
      answers: session.answers,
      totalQuestionsAnswered: session.answers.length,
    };
  } catch (error) {
    console.error("Error in getSession:", error);
    throw error;
  }
};

/**
 * Save an answer to existing session
 */
const saveAnswer = async (sessionId, answerData) => {
  try {
    const { questionId, questionText, answerSelected, timestamp } = answerData;

    // Find the session
    const session = await SessionInfo.findOne({ sessionId });

    if (!session) {
      throw new Error("Session not found");
    }

    // Check if this question was already answered
    const existingAnswerIndex = session.answers.findIndex(
      (a) => a.questionId === questionId,
    );

    const newAnswer = {
      questionId,
      questionText,
      answerSelected,
      timestamp: timestamp || new Date(),
    };

    if (existingAnswerIndex !== -1) {
      // Update existing answer (replace with new one)
      session.answers[existingAnswerIndex] = newAnswer;
    } else {
      // Add new answer
      session.answers.push(newAnswer);
    }

    await session.save();

    return {
      sessionId: session.sessionId,
      questionId,
      answerSaved: true,
      totalAnswers: session.answers.length,
      status: session.status,
    };
  } catch (error) {
    console.error("Error in saveAnswer:", error);
    throw error;
  }
};

/**
 * Complete/End a session
 */
const completeSession = async (sessionId) => {
  try {
    const session = await SessionInfo.findOne({ sessionId });

    if (!session) {
      throw new Error("Session not found");
    }

    session.status = "completed";
    session.sessionEndTimestamp = new Date();

    await session.save();

    return {
      sessionId: session.sessionId,
      status: session.status,
      sessionEndTimestamp: session.sessionEndTimestamp,
      totalQuestionsAnswered: session.answers.length,
    };
  } catch (error) {
    console.error("Error in completeSession:", error);
    throw error;
  }
};

/**
 * Get session summary/progress
 */
const getSessionProgress = async (sessionId) => {
  try {
    const session = await SessionInfo.findOne({ sessionId });

    if (!session) {
      return null;
    }

    // Get the last answered question (most recent)
    const lastAnswer =
      session.answers.length > 0
        ? session.answers.sort((a, b) => b.timestamp - a.timestamp)[0]
        : null;

    return {
      sessionId: session.sessionId,
      status: session.status,
      sessionStartTimestamp: session.sessionStartTimestamp,
      sessionEndTimestamp: session.sessionEndTimestamp,
      totalQuestionsAnswered: session.answers.length,
      lastQuestionId: lastAnswer?.questionId,
      lastQuestionText: lastAnswer?.questionText,
      lastAnswerTimestamp: lastAnswer?.timestamp,
      answeredQuestionIds: session.answers.map((a) => a.questionId),
    };
  } catch (error) {
    console.error("Error in getSessionProgress:", error);
    throw error;
  }
};

module.exports = {
  createSession,
  getSession,
  saveAnswer,
  completeSession,
  getSessionProgress,
};
