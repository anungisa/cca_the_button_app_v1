import { InvokeLLM } from "@/api/integrations";
import { AuditLogService } from './AuditLogService';

/**
 * Centralized service for interacting with AI models.
 * Handles prompt construction, API calls, and logging.
 */
export const AIService = {
  /**
   * Generates a text-based insight or summary from the LLM.
   * @param {string} prompt - The prompt to send to the LLM.
   * @param {object} context - Additional context for the prompt.
   * @param {boolean} addContextFromInternet - Whether to use web search.
   * @returns {Promise<string>} - The AI-generated text.
   */
  async generateInsight(prompt, context = {}, addContextFromInternet = false) {
    try {
      const fullPrompt = `
        Context: ${JSON.stringify(context, null, 2)}
        ---
        Task: ${prompt}
      `;
      
      const response = await InvokeLLM({
        prompt: fullPrompt,
        add_context_from_internet: addContextFromInternet,
      });

      await AuditLogService.log('AI_INSIGHT_GENERATED', { prompt, context });
      
      return response;
    } catch (error) {
      console.error("AI Insight generation failed:", error);
      await AuditLogService.log('AI_ERROR', { error: error.message, prompt });
      return "I was unable to process this request. Please try again.";
    }
  },

  /**
   * Generates structured JSON data from the LLM.
   * @param {string} prompt - The prompt describing the desired data.
   * @param {object} responseSchema - The JSON schema for the expected output.
   * @param {object} context - Additional context for the prompt.
   * @returns {Promise<object|null>} - The AI-generated JSON object, or null on failure.
   */
  async getStructuredData(prompt, responseSchema, context = {}) {
    try {
      const fullPrompt = `
        Based on the following context, please generate a JSON object that strictly adheres to the provided schema.
        Context: ${JSON.stringify(context, null, 2)}
        ---
        Task: ${prompt}
      `;

      const response = await InvokeLLM({
        prompt: fullPrompt,
        response_json_schema: responseSchema,
      });
      
      await AuditLogService.log('AI_STRUCTURED_DATA_GENERATED', { prompt, context });

      return response;
    } catch (error) {
      console.error("AI structured data generation failed:", error);
      await AuditLogService.log('AI_ERROR', { error: error.message, prompt });
      return null;
    }
  },
};