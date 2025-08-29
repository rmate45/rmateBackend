const openai = require('../config/openai');

class AssistantService {
    constructor() {
        this.assistant = null;
    }

    async getAssistant() {
        try {
            if (!process.env.OPENAI_ASSISTANT_ID) {
                throw new Error('OPENAI_ASSISTANT_ID is required in environment variables');
            }

            // Retrieve the existing assistant
            this.assistant = await openai.beta.assistants.retrieve(
                process.env.OPENAI_ASSISTANT_ID
            );
            return this.assistant;
        } catch (error) {
            console.error('Error getting assistant:', error);
            throw error;
        }
    }
}

module.exports = new AssistantService(); 