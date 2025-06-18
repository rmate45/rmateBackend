const resMessages = require("../constants/resMessages.constants")
const { errorResponse, successResponse } = require("../utils/responseHandler.util")
const { getPrimeQuestions, getNextQuestion } = require("../services/questionnarie.service")
const { v4: uuidv4 } = require('uuid');


exports.getPrimeQuestions = async (req, res) => {
    try {

        const uuid = uuidv4()
        const questions = await getPrimeQuestions()
       
        let data = {
            userId: uuid,
            questions: questions
        }

        return res.status(200).json(successResponse(resMessages.success.dataRetrieved, data))

    } catch (error) {

        console.log("ERROR::", error)
        return res.status(500).json(errorResponse(resMessages.generalError.somethingWentWrong, error.message))

    }
}

exports.getNextQuestion = async (req, res) => {
    try {
        let { prime_value, next_question } = req.body

        if(!next_question){return res.status(400).json(errorResponse(resMessages.generalError.somethingWentWrong,"Please provide next question value"))}

        let {question,isLastQuestion} = await getNextQuestion(prime_value, next_question);
        
        return res.status(200).json(successResponse("Next question fetched successfully",{isLastQuestion,question}));

    } catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json(errorResponse(resMessages.generalError.somethingWentWrong, error.message))
    }
}