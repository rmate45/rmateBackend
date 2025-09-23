const express = require("express");
const router = express.Router();
const questionnarieController = require("../../controllers/questionnaireController");
const manageQuestionnire = require("../../controllers/manageQuestionnaire.controller");
const financialAdvisorController = require("../../controllers/financial.controller");
const chatController = require("../../controllers/chatController");
const userController = require("../../controllers/userController");
const projectionController = require("../../controllers/retirementProjectionController");
const { body } = require("express-validator");

//questionnaire
router.get("/get-prime-questions", questionnarieController.getPrimeQuestions);
router.post("/get-next-question", questionnarieController.getNextQuestion);
router.post("/check-valid-zipcode", questionnarieController.checkZipCode);

//mangage questionnaire
router.post("/upload-file", manageQuestionnire.uploadFile);

//financial advisors
router.get(
  "/get-financial-advisors",
  financialAdvisorController.getFinancialAdvisors
);
router.post(
  "/upload-financial-advisor-file",
  financialAdvisorController.uploadFinancialAdvisorFile
);
router.post(
  "/upload-financial-reference",
  financialAdvisorController.uploadFinancialReference
);
router.post(
  "/upload-saving-by-age",
  financialAdvisorController.uploadSavingByAge
);
router.post(
  "/upload-survey-range-file",
  financialAdvisorController.uploadSurveyRangeFile
);
router.post("/upload-zipcodes", financialAdvisorController.uploadZipCodes);
router.post("/upload-savings-at-67", financialAdvisorController.savingsAt67);
router.post(
  "/calculate-results-level1",
  financialAdvisorController.calculateResultsLevel1
);

router.post(
  "/send",
  [
    body("userId").notEmpty().withMessage("userId is required"),
    body("message").notEmpty().withMessage("message is required"),
  ],
  chatController.sendMessage
);

router.post("/upload-statements", questionnarieController.uploadStatements);
router.get("/get-statements", questionnarieController.getAllStatements);
router.post(
  "/upload-intake-questions",
  questionnarieController.uploadIntakeQuestions
);
router.get(
  "/get-intake-questions",
  questionnarieController.getAllIntakeQuestions
);
router.get(
  "/get-intake-question/:questionId",
  questionnarieController.getIntakeQuestion
);

router.post("/save", userController.saveResponse);
router.get("/user/:phoneNumber", userController.getUser);
router.get("/user/:phoneNumber/profile", userController.getUserProfile);
router.get(
  "/user/:phoneNumber/question/:questionId",
  userController.getResponse
);
router.get("/users", userController.getAllUsers);
router.get("/user/:phoneNumber/plan/:planId", userController.getRetirementPlan);

router.post(
  "/calculate-saving-projection",
  projectionController.calculateProjection
);

router.post(
  "/upload-retirement-questions",
  questionnarieController.uploadRetirementQuestions
);

// Get retirement questions with filters
router.get(
  "/retirement-questions",
  questionnarieController.getRetirementQuestions
);

// Get available age groups
router.get("/age-groups", questionnarieController.getAgeGroups);

// Get question statistics
router.get("/question-stats", questionnarieController.getQuestionStats);

module.exports = router;
