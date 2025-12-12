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
router.get("/get-personas", questionnarieController.getAllPersonas);
router.get("/get-persona/:id", questionnarieController.getPersonaById);

router.get(
  "/get-financial-plannings",
  questionnarieController.getAllFinancialPlannings
);
router.get(
  "/get-financial-planning/:planningId",
  questionnarieController.getFinancialPlanningById
);

router.get(
  "/get-explore-questions",
  questionnarieController.getAllExploreQuestions
);
router.get(
  "/get-explore-question/:questionId",
  questionnarieController.getExploreQuestionById
);

router.get("/get-roth-questions", questionnarieController.getAllRothQuestions);
router.get(
  "/get-roth-question/:rothQuestionId",
  questionnarieController.getRothQuestionById
);

router.get(
  "/get-medicare-questions",
  questionnarieController.getAllMedicareQuestions
);
router.get(
  "/get-medicare-question/:medicareQuestionId",
  questionnarieController.getMedicareQuestionById
);

router.get(
  "/get-asked-questions",
  questionnarieController.getAllAskedQuestions
);

router.get("/get-articles", questionnarieController.getAllArticles);
router.get("/get-article/:id", questionnarieController.getArticleById);
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

router.get("/get-medi-questions", questionnarieController.getMedicareQuestions);

router.post("/save", userController.saveResponse);
router.get("/user/:phoneNumber", userController.getUser);
router.get("/user/:phoneNumber/profile", userController.getUserProfile);
router.get(
  "/user/:phoneNumber/question/:questionId",
  userController.getResponse
);
router.get("/users", userController.getAllUsers);
router.get("/user/:phoneNumber/plan/:planId", userController.getRetirementPlan);

router.post("/save-demographic", userController.saveUserDemographic);
router.get("/get-demographic/:id", userController.getUserDemographicById);

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
