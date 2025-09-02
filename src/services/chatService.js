const openai = require("../config/openai");
const assistantService = require("./assistantService");

class ChatService {
  constructor() {
    this.threads = new Map();
    this.initializeAssistant();
  }

  async initializeAssistant() {
    try {
      await assistantService.getAssistant();
    } catch (error) {
      console.error("Failed to initialize assistant:", error);
      throw error;
    }
  }

  async getOrCreateThread(userId) {
    if (this.threads.has(userId)) {
      console.log("Thread already exists");
      return this.threads.get(userId);
    }

    const thread = await openai.beta.threads.create();
    this.threads.set(userId, thread.id);
    return thread.id;
  }

  async sendMessage(userId, message, res) {
    try {
      const threadId = await this.getOrCreateThread(userId);

      // Add the user's message to the thread
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message,
      });

      let accumulatedData = "";

      // Create and run the assistant
      const run = openai.beta.threads.runs
        .stream(threadId, {
          assistant_id: process.env.OPENAI_ASSISTANT_ID,
        })
        .on("textCreated", (text) => {
          console.log("\nassistant > ");
          // Send an event indicating the start of the response
          res.write("data: " + JSON.stringify({ type: "start" }) + "\n\n");
        })
        .on("textDelta", (textDelta) => {
          console.log(textDelta.value);
          // Send the actual content as an SSE event
          res.write(
            "data: " +
              JSON.stringify({
                type: "delta",
                content: textDelta.value,
              }) +
              "\n\n"
          );
          accumulatedData += textDelta.value;
        })
        .on("error", (error) => {
          console.error("Stream error:", error);
          res.write(
            "data: " +
              JSON.stringify({
                type: "error",
                error: "Stream error occurred",
              }) +
              "\n\n"
          );
          res.end();
        })
        .on("end", () => {
          console.log("Stream ended");
          // Send the final complete message
          res.write(
            "data: " +
              JSON.stringify({
                type: "end",
                content: accumulatedData,
              }) +
              "\n\n"
          );
          res.end();
        });

      return accumulatedData;
    } catch (error) {
      console.error("Error in chat service:", error);
      throw error;
    }
  }

  // Method to update assistant configuration
  async updateAssistantConfig(config) {
    return await assistantService.updateAssistant(config);
  }

  async generateRetirementPlan(prompt) {
    try {
      // Create a new thread for plan generation
      let thread = await openai.beta.threads.create();

      // Add the retirement plan prompt to the thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: prompt,
      });
      console.log("thread---", thread.id);
      console.log(
        "process.env.OPENAI_ASSISTANT_ID---",
        process.env.OPENAI_ASSISTANT_ID
      );
      // Run the assistant
      let run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: process.env.OPENAI_ASSISTANT_ID,
      });
      console.log("run---", run);
      // Wait for completion
      let runStatus = await openai.beta.threads.runs.retrieve(run.id, {
        thread_id: thread.id,
      });
      while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(run.id, {
          thread_id: thread.id,
        });

        if (runStatus.status === "failed") {
          throw new Error("AI plan generation failed");
        }
      }

      // Get the generated response
      const messages = await openai.beta.threads.messages.list(thread.id);
      const assistantMessage = messages.data.find(
        (m) => m.role === "assistant"
      );

      if (assistantMessage && assistantMessage.content.length > 0) {
        return {
          content: assistantMessage.content[0].text.value,
          threadId: thread.id,
        };
      }

      throw new Error("No response from AI assistant");
    } catch (error) {
      console.error("Error generating retirement plan:", error);
      throw error;
    }
  }
}

module.exports = new ChatService();
