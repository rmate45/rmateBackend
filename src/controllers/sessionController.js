const sessionService = require("../services/sessionService");
const {
  errorResponse,
  successResponse,
} = require("../utils/responseHandler.util");

exports.startSession = async (req, res) => {
  try {
    const session = await sessionService.createSession();

    return res.status(200).json(
      successResponse("Session started successfully", {
        sessionId: session.sessionId,
        sessionStartTimestamp: session.sessionStartTimestamp,
      }),
    );
  } catch (error) {
    console.error("ERROR::startSession:", error);
    return res
      .status(500)
      .json(errorResponse("Failed to start session", error.message));
  }
};

/**
 * Save an answer
 * POST /api/session/answer
 */
exports.saveAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, questionText, answerSelected, timestamp } =
      req.body;

    // Validation
    if (!sessionId) {
      return res.status(400).json(errorResponse("Session ID is required"));
    }

    if (!questionId) {
      return res.status(400).json(errorResponse("Question ID is required"));
    }

    if (!questionText) {
      return res.status(400).json(errorResponse("Question text is required"));
    }

    if (!answerSelected) {
      return res.status(400).json(errorResponse("Answer selected is required"));
    }

    const result = await sessionService.saveAnswer(sessionId, {
      questionId,
      questionText,
      answerSelected,
      timestamp: timestamp || new Date(),
    });

    return res
      .status(200)
      .json(successResponse("Answer saved successfully", result));
  } catch (error) {
    console.error("ERROR::saveAnswer:", error);

    if (error.message === "Session not found") {
      return res.status(404).json(errorResponse("Session not found"));
    }

    return res
      .status(500)
      .json(errorResponse("Failed to save answer", error.message));
  }
};

/**
 * Get session details
 * GET /api/session/:sessionId
 */
exports.getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json(errorResponse("Session ID is required"));
    }

    const session = await sessionService.getSession(sessionId);

    if (!session) {
      return res.status(404).json(errorResponse("Session not found"));
    }

    return res
      .status(200)
      .json(successResponse("Session retrieved successfully", session));
  } catch (error) {
    console.error("ERROR::getSession:", error);
    return res
      .status(500)
      .json(errorResponse("Failed to get session", error.message));
  }
};

/**
 * Complete a session
 * PUT /api/session/complete
 */
exports.completeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json(errorResponse("Session ID is required"));
    }

    const result = await sessionService.completeSession(sessionId);

    return res
      .status(200)
      .json(successResponse("Session completed successfully", result));
  } catch (error) {
    console.error("ERROR::completeSession:", error);

    if (error.message === "Session not found") {
      return res.status(404).json(errorResponse("Session not found"));
    }

    return res
      .status(500)
      .json(errorResponse("Failed to complete session", error.message));
  }
};

/**
 * Get session progress
 * GET /api/session/progress/:sessionId
 */
exports.getSessionProgress = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json(errorResponse("Session ID is required"));
    }

    const progress = await sessionService.getSessionProgress(sessionId);

    if (!progress) {
      return res.status(404).json(errorResponse("Session not found"));
    }

    return res
      .status(200)
      .json(
        successResponse("Session progress retrieved successfully", progress),
      );
  } catch (error) {
    console.error("ERROR::getSessionProgress:", error);
    return res
      .status(500)
      .json(errorResponse("Failed to get session progress", error.message));
  }
};
