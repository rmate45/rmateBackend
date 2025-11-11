const resMessages = require("../constants/resMessages.constants");
const {
  errorResponse,
  successResponse,
} = require("../utils/responseHandler.util");
const {
  getPrimeQuestions,
  getNextQuestion,
  processStatementsExcel,
  getAllStatements,
  processIntakeQuestionsExcel,
  getAllIntakeQuestions,
  getIntakeQuestionById,
} = require("../services/questionnarie.service");
const { v4: uuidv4 } = require("uuid");
const zipcodeLocationsModel = require("../models/zipcode-locations.model");
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");
const statementService = require("../services/questionnarie.service");
const retirementQuestionService = require("../services/questionnarie.service");

exports.getPrimeQuestions = async (req, res) => {
  try {
    const uuid = uuidv4();
    const questions = await getPrimeQuestions();

    let data = {
      userId: uuid,
      questions: questions,
    };

    return res
      .status(200)
      .json(successResponse(resMessages.success.dataRetrieved, data));
  } catch (error) {
    console.log("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getNextQuestion = async (req, res) => {
  try {
    let { prime_value, next_question } = req.body;

    if (!next_question) {
      return res
        .status(400)
        .json(
          errorResponse(
            resMessages.generalError.somethingWentWrong,
            "Please provide next question value"
          )
        );
    }

    let { question, isLastQuestion } = await getNextQuestion(
      prime_value,
      next_question
    );

    return res.status(200).json(
      successResponse("Next question fetched successfully", {
        isLastQuestion,
        question,
      })
    );
  } catch (error) {
    console.log("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.checkZipCode = async (req, res) => {
  try {
    const zipcode = req.body.zipcode;
    if (!zipcode) {
      return res
        .status(400)
        .json(
          errorResponse(
            resMessages.generalError.somethingWentWrong,
            "Please provide zip-code."
          )
        );
    }

    const isZipCodeExist = await zipcodeLocationsModel.findOne({
      zipCode: zipcode,
    });

    if (!isZipCodeExist) {
      return res
        .status(400)
        .json(errorResponse("Please enter a valid U.S. ZIP code."));
    }

    return res.status(200).json(successResponse("ZIP code validation passed."));
  } catch (error) {
    console.log("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.uploadStatements = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json(errorResponse("No file uploaded"));
    }

    const file = req.files.file;

    // Check if file is Excel
    if (path.extname(file.name) !== ".xlsx") {
      return res
        .status(400)
        .json(errorResponse("Only .xlsx files are allowed."));
    }

    // Save file temporarily
    const uploadPath = path.join(__dirname, "../uploads", file.name);
    await file.mv(uploadPath);

    // Read Excel file
    const workbook = XLSX.readFile(uploadPath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "",
    });

    // Process the data
    await processStatementsExcel(data);

    // Delete temporary file
    fs.unlinkSync(uploadPath);

    return res
      .status(200)
      .json(successResponse("Statements successfully processed and updated."));
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getAllStatements = async (req, res) => {
  try {
    const statements = await getAllStatements();
    return res
      .status(200)
      .json(successResponse("Statements retrieved successfully", statements));
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.uploadIntakeQuestions = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json(errorResponse("No file uploaded"));
    }

    const file = req.files.file;

    // Check if file is Excel
    if (path.extname(file.name) !== ".xlsx") {
      return res
        .status(400)
        .json(errorResponse("Only .xlsx files are allowed."));
    }

    // Save file temporarily
    const uploadPath = path.join(__dirname, "../uploads", file.name);
    await file.mv(uploadPath);

    // Read Excel file
    const workbook = XLSX.readFile(uploadPath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "",
    });

    // Process the data
    await processIntakeQuestionsExcel(data);

    // Delete temporary file
    fs.unlinkSync(uploadPath);

    return res
      .status(200)
      .json(
        successResponse("Intake questions successfully processed and updated.")
      );
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getAllIntakeQuestions = async (req, res) => {
  try {
    const questions = await getAllIntakeQuestions();
    return res
      .status(200)
      .json(
        successResponse("Intake questions retrieved successfully", questions)
      );
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getIntakeQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await getIntakeQuestionById(questionId);

    if (!question) {
      return res.status(404).json(errorResponse("Question not found"));
    }

    return res
      .status(200)
      .json(successResponse("Question retrieved successfully", question));
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.uploadRetirementQuestions = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json(errorResponse("No file uploaded"));
    }

    const file = req.files.file;

    // Check if file is Excel
    if (!file.name.endsWith(".xlsx")) {
      return res
        .status(400)
        .json(errorResponse("Only .xlsx files are allowed."));
    }

    // Save file temporarily
    const uploadPath = require("path").join(__dirname, "../uploads", file.name);
    await file.mv(uploadPath);

    // Read Excel file
    const XLSX = require("xlsx");
    const workbook = XLSX.readFile(uploadPath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "",
    });

    console.log(`Read ${data.length} rows from Excel file`);

    // Log first few rows for debugging
    console.log("First 3 rows sample:");
    data.slice(0, 3).forEach((row, index) => {
      console.log(`Row ${index + 1}:`, {
        ageGroup: row["Age Group"],
        prompt: row["Prompt"],
        gender: row["Gender"],
      });
    });

    // Process the data
    const result =
      await retirementQuestionService.processRetirementQuestionsExcel(data);

    // Delete temporary file
    const fs = require("fs");
    fs.unlinkSync(uploadPath);

    return res.status(200).json(
      successResponse(result.message, {
        count: result.count,
      })
    );
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getRetirementQuestions = async (req, res) => {
  try {
    const { ageGroup, gender, page, limit } = req.query;

    const filters = {};

    if (ageGroup) filters.ageGroup = ageGroup;
    if (gender) filters.gender = gender;
    if (page) filters.page = page;
    if (limit) filters.limit = limit;

    const result = await retirementQuestionService.getRetirementQuestions(
      filters
    );

    return res
      .status(200)
      .json(
        successResponse("Retirement questions fetched successfully", result)
      );
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getAgeGroups = async (req, res) => {
  try {
    const ageGroups = await retirementQuestionService.getAgeGroups();

    return res
      .status(200)
      .json(successResponse("Age groups fetched successfully", { ageGroups }));
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getQuestionStats = async (req, res) => {
  try {
    const stats = await retirementQuestionService.getQuestionStats();

    return res
      .status(200)
      .json(
        successResponse("Question statistics fetched successfully", { stats })
      );
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getAllPersonas = async (req, res) => {
  try {
    const personas = await retirementQuestionService.getAllPersonas();
    return res
      .status(200)
      .json(successResponse("Personas retrieved successfully", personas));
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getPersonaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(errorResponse("Persona ID is required"));
    }

    const persona = await retirementQuestionService.getPersonaById(id);

    if (!persona) {
      return res.status(404).json(errorResponse("Persona not found"));
    }

    return res
      .status(200)
      .json(successResponse("Persona retrieved successfully", persona));
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getAllFinancialPlannings = async (req, res) => {
  try {
    console.log("data---");
    const financialPlannings =
      await retirementQuestionService.getAllFinancialPlannings();
    console.log("here---", financialPlannings);
    return res
      .status(200)
      .json(
        successResponse(
          "Financial plannings retrieved successfully",
          financialPlannings
        )
      );
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getFinancialPlanningById = async (req, res) => {
  try {
    const { planningId } = req.params;
    const financialPlanning =
      await retirementQuestionService.getFinancialPlanningById(planningId);

    if (!financialPlanning) {
      return res
        .status(404)
        .json(errorResponse("Financial planning not found"));
    }

    return res
      .status(200)
      .json(
        successResponse(
          "Financial planning retrieved successfully",
          financialPlanning
        )
      );
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getAllRothQuestions = async (req, res) => {
  try {
    const rothQuestions = await retirementQuestionService.getAllRothQuestions();
    return res
      .status(200)
      .json(
        successResponse("Roth questions retrieved successfully", rothQuestions)
      );
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getRothQuestionById = async (req, res) => {
  try {
    const { rothQuestionId } = req.params;
    const rothQuestion = await retirementQuestionService.getRothQuestionById(
      rothQuestionId
    );

    if (!rothQuestion) {
      return res.status(404).json(errorResponse("Roth question not found"));
    }

    return res
      .status(200)
      .json(
        successResponse("Roth question retrieved successfully", rothQuestion)
      );
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getAllExploreQuestions = async (req, res) => {
  try {
    const exploreQuestions =
      await retirementQuestionService.getAllExploreQuestions();
    return res
      .status(200)
      .json(
        successResponse(
          "Explore questions retrieved successfully",
          exploreQuestions
        )
      );
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getExploreQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    const exploreQuestion =
      await retirementQuestionService.getExploreQuestionById(questionId);

    if (!exploreQuestion) {
      return res.status(404).json(errorResponse("Explore question not found"));
    }

    return res
      .status(200)
      .json(
        successResponse(
          "Explore question retrieved successfully",
          exploreQuestion
        )
      );
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          resMessages.generalError.somethingWentWrong,
          error.message
        )
      );
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await retirementQuestionService.getAllArticles();
    return res
      .status(200)
      .json(successResponse("Articles retrieved successfully", articles));
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Something went wrong while fetching articles",
          error.message
        )
      );
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(errorResponse("Article ID is required"));
    }

    const article = await retirementQuestionService.getArticleById(id);

    if (!article) {
      return res.status(404).json(errorResponse("Article not found"));
    }

    return res
      .status(200)
      .json(successResponse("Article retrieved successfully", article));
  } catch (error) {
    console.error("ERROR::", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Something went wrong while fetching the article",
          error.message
        )
      );
  }
};
