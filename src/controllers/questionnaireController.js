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
