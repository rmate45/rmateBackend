const primeQuestionsModel = require("../models/questions-prime.model");
const QuestionsByAgeGroupModel = require("../models/questions-byAgeGroup.model");
const Statement = require("../models/Statement");
const IntakeQuestionModel = require("../models/IntakeQuestion");

const getPrimeQuestions = async () => {
  try {
    let questions = await primeQuestionsModel
      .find()
      .select(
        "questionText type options questionText system_greetings quiz_no"
      );
    return questions;
  } catch (error) {
    throw error.message;
  }
};

const getValidPrimeValues = async () => {
  try {
    const primeQuestion = await primeQuestionsModel.findOne();
    if (!primeQuestion || !primeQuestion.options) return [];
    return primeQuestion.options.map((opt) => opt.value);
  } catch (err) {
    console.error("Error fetching valid prime values:", err);
    throw new Error("Failed to retrieve valid prime values.");
  }
};

const getNextQuestion = async (prime_value, next_question) => {
  try {
    const validValues = await getValidPrimeValues();
    if (!validValues.includes(prime_value)) {
      throw new Error("Invalid prime value.");
    }
    const ageGroupDoc = await QuestionsByAgeGroupModel.findOne({
      value: prime_value,
    });
    if (!ageGroupDoc)
      throw new Error("No questions found for this prime value.");

    const question = ageGroupDoc.questions.find(
      (q) => q.question_number === Number(next_question)
    );
    if (!question) throw new Error("Question not found.");

    const isLastQuestion =
      Number(next_question) >= ageGroupDoc.questions.length;

    return { question, isLastQuestion };
  } catch (error) {
    console.error("Error in getNextQuestion:", error);
    throw new Error(error.message || "Failed to get next question.");
  }
};

const processStatementsExcel = async (data) => {
  try {
    const statements = [];

    for (const row of data) {
      // Skip empty rows or rows without Q#
      if (!row["Q#"] || !row["Question"]) continue;

      const statementId = row["Q#"].trim();
      const question = row["Question"].trim();

      statements.push({
        statementId,
        question,
      });
    }

    // Delete all existing statements
    await Statement.deleteMany({});

    // Insert new statements in order
    await Statement.insertMany(statements);

    return statements;
  } catch (error) {
    console.error("Error processing statements Excel:", error);
    throw error;
  }
};

const getAllStatements = async () => {
  try {
    return await Statement.find().sort({ position: 1 });
  } catch (error) {
    console.error("Error fetching statements:", error);
    throw error;
  }
};

const processIntakeQuestionsExcel = async (data) => {
  try {
    const questionsMap = new Map();
    let position = 1;

    for (const row of data) {
      // Skip empty rows or rows without Q#
      if (!row["Q#"] || !row["Question"]) continue;

      const questionId = row["Q#"].trim();
      const questionText = row["Question"].trim();
      const optionText = row["Option"] ? row["Option"].trim() : "";
      const comment = row["Comment"] ? row["Comment"].trim() : "";
      const actionTypeA = row["Action Type A"]
        ? row["Action Type A"].trim()
        : "";
      const actionTypeB = row["Action Type B"]
        ? row["Action Type B"].trim()
        : "";

      // Determine input type based on Action Type A column
      let inputType = "free_text";
      if (actionTypeA === "Single Select") {
        inputType = "single_select";
      } else if (actionTypeA === "Multiselect") {
        inputType = "multi_select";
      }

      if (!questionsMap.has(questionId)) {
        // New question found
        questionsMap.set(questionId, {
          questionId,
          questionText,
          inputType,
          defaultComment: comment,
          options: [],
          position: position++,
        });
      }

      // Add option to existing question (if it's not a free text question)
      if (
        inputType !== "free_text" &&
        optionText &&
        optionText !== "(Free Text)"
      ) {
        const question = questionsMap.get(questionId);

        // Check if option already exists
        const optionExists = question.options.some(
          (opt) => opt.text === optionText
        );

        if (!optionExists) {
          question.options.push({
            text: optionText,
            comment: comment !== question.defaultComment ? comment : "",
            actionTypeA,
            actionTypeB,
          });
        }

        // Update default comment if this row has a different comment
        if (comment && comment !== question.defaultComment) {
          question.defaultComment = comment;
        }
      }
    }

    // Convert map to array
    const questions = Array.from(questionsMap.values());

    // Delete all existing intake questions
    await IntakeQuestionModel.deleteMany({});

    // Insert new questions in order
    await IntakeQuestionModel.insertMany(questions);

    return questions;
  } catch (error) {
    console.error("Error processing intake questions Excel:", error);
    throw error;
  }
};

const getAllIntakeQuestions = async () => {
  try {
    return await IntakeQuestionModel.find().sort({ position: 1 });
  } catch (error) {
    console.error("Error fetching intake questions:", error);
    throw error;
  }
};

const getIntakeQuestionById = async (questionId) => {
  try {
    return await IntakeQuestionModel.findOne({ _id: questionId });
  } catch (error) {
    console.error("Error fetching intake question:", error);
    throw error;
  }
};

module.exports = {
  getPrimeQuestions,
  getNextQuestion,
  processStatementsExcel,
  getAllStatements,
  processIntakeQuestionsExcel,
  getAllIntakeQuestions,
  getIntakeQuestionById,
};
