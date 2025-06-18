const primeQuestionsModel = require('../models/questions-prime.model')
const QuestionsByAgeGroupModel = require('../models/questions-byAgeGroup.model')


const getPrimeQuestions = async () => {
    try {
        let questions = await primeQuestionsModel.find().select('questionText type options questionText system_greetings quiz_no')
        return questions
    } catch (error) {
        throw error.message
    }
}

const getValidPrimeValues = async () => {
    try {
        const primeQuestion = await primeQuestionsModel.findOne();
        if (!primeQuestion || !primeQuestion.options) return [];
        return primeQuestion.options.map(opt => opt.value);
    } catch (err) {
        console.error('Error fetching valid prime values:', err);
        throw new Error('Failed to retrieve valid prime values.');
    }
};


const getNextQuestion = async (prime_value, next_question) => {
    try {
        const validValues = await getValidPrimeValues();
        if (!validValues.includes(prime_value)) {
            throw new Error('Invalid prime value.');
        }
        const ageGroupDoc = await QuestionsByAgeGroupModel.findOne({ value: prime_value });
        if (!ageGroupDoc) throw new Error("No questions found for this prime value.");

        const question = ageGroupDoc.questions.find(q => q.question_number === Number(next_question));
        if (!question) throw new Error("Question not found.");

        const isLastQuestion = Number(next_question) >= ageGroupDoc.questions.length;

        return { question, isLastQuestion };
    } catch (error) {
        console.error('Error in getNextQuestion:', error);
        throw new Error(error.message || 'Failed to get next question.');
    }
};


module.exports = { getPrimeQuestions, getNextQuestion };
