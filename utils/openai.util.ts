import OpenAI from "openai";

// Types for the summary utility
export interface SummaryOptions {
  maxLength?: number;
  style?: "concise" | "detailed" | "bullet-points";
  language?: string;
  includeKeyPoints?: boolean;
}

export interface SummaryResult {
  summary: string;
  keyPoints?: string[];
  wordCount: number;
  processingTime: number;
}

export interface OpenAIConfig {
  apiKey?: string; // Now optional, will use env if not provided
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

// Sentiment/Intent/Keyword/AI Analysis types
export type SentimentType = "positive" | "neutral" | "negative";
export interface TextAnalysisResult {
  sentiment: SentimentType;
  intent: string;
  keywords: string[];
  aiAnalysis: string;
}

/**
 * Singleton class for OpenAISummaryUtil
 */
class OpenAISummaryUtil {
  private static instance: OpenAISummaryUtil | null = null;
  private openai: OpenAI | null = null;
  private config: OpenAIConfig;

  private constructor(config: OpenAIConfig) {
    // If apiKey is not provided, try to get it from environment variable
    const apiKey =
      config.apiKey ||
      process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "OpenAI API key not found. Please set it in your environment variables (NEXT_PUBLIC_OPENAI_API_KEY or OPENAI_API_KEY) or pass it in the config."
      );
    }

    this.config = {
      model: "gpt-3.5-turbo",
      maxTokens: 500,
      temperature: 0.7,
      ...config,
      apiKey,
    };

    this.initializeOpenAI();
  }

  /**
   * Get the singleton instance, initializing if necessary.
   */
  public static getInstance(config?: OpenAIConfig): OpenAISummaryUtil {
    if (!OpenAISummaryUtil.instance) {
      OpenAISummaryUtil.instance = new OpenAISummaryUtil(config || {});
    } else if (config) {
      OpenAISummaryUtil.instance.updateConfig(config);
    }
    return OpenAISummaryUtil.instance;
  }

  private initializeOpenAI() {
    try {
      this.openai = new OpenAI({
        apiKey: this.config.apiKey!,
        dangerouslyAllowBrowser: true, // Only for client-side usage
      });
    } catch (error) {
      console.error("Failed to initialize OpenAI:", error);
      throw new Error("OpenAI initialization failed");
    }
  }

  /**
   * Generate a summary of the provided text using OpenAI
   */
  async generateSummary(
    text: string,
    options: SummaryOptions = {}
  ): Promise<SummaryResult> {
    if (!this.openai) {
      throw new Error("OpenAI not initialized. Please provide an API key.");
    }

    if (!text || text.trim().length === 0) {
      throw new Error("Text content is required for summarization.");
    }

    const startTime = Date.now();

    try {
      const {
        maxLength = 150,
        style = "concise",
        language = "English",
        includeKeyPoints = false,
      } = options;

      // Create the prompt based on style
      const stylePrompts = {
        concise: `Provide a concise summary of the following text in ${language} (maximum ${maxLength} words):`,
        detailed: `Provide a detailed summary of the following text in ${language} (maximum ${maxLength} words):`,
        "bullet-points": `Provide a summary of the following text in ${language} as bullet points (maximum ${maxLength} words):`,
      };

      const basePrompt = stylePrompts[style];
      const keyPointsPrompt = includeKeyPoints
        ? "\n\nAlso provide 3-5 key points from the text."
        : "";

      const prompt = `${basePrompt}${keyPointsPrompt}\n\nText: ${text}`;

      const response = await this.openai.chat.completions.create({
        model: this.config.model!,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that creates clear and accurate summaries.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });

      const summary = response.choices[0]?.message?.content || "";
      const processingTime = Date.now() - startTime;

      // Parse key points if requested
      let keyPoints: string[] | undefined;
      let summaryText = summary;
      if (
        (includeKeyPoints && summary.includes("Key points:")) ||
        summary.includes("Key Points:")
      ) {
        const parts = summary.split(/Key points?:/i);
        if (parts.length > 1) {
          summaryText = parts[0].trim();
          const keyPointsText = parts[1].trim();
          keyPoints = keyPointsText
            .split(/\n/)
            .map((point) => point.replace(/^[-•*]\s*/, "").trim())
            .filter((point) => point.length > 0);
        }
      }

      return {
        summary: summaryText,
        keyPoints,
        wordCount: summaryText.split(/\s+/).length,
        processingTime,
      };
    } catch (error) {
      console.error("Error generating summary:", error);
      throw new Error(
        error instanceof Error
          ? `Summary generation failed: ${error.message}`
          : "Summary generation failed"
      );
    }
  }

  /**
   * Generate a summary for multiple texts
   */
  async generateBatchSummaries(
    texts: string[],
    options: SummaryOptions = {}
  ): Promise<SummaryResult[]> {
    const summaries: SummaryResult[] = [];

    for (const text of texts) {
      try {
        const summary = await this.generateSummary(text, options);
        summaries.push(summary);
      } catch (error) {
        console.error(
          `Failed to summarize text: ${text.substring(0, 100)}...`,
          error
        );
        summaries.push({
          summary: "Summary generation failed",
          wordCount: 0,
          processingTime: 0,
        });
      }
    }

    return summaries;
  }

  /**
   * Analyze sentiment, intent, keywords, and provide AI analysis for a text.
   * Sentiment: "positive", "neutral", or "negative"
   * Intent: e.g. "billing inquiry"
   * Keywords: up to 3, e.g. ["billing", "payment", "account"]
   * aiAnalysis: e.g. "customer happy"
   */
  async analyzeText(text: string): Promise<TextAnalysisResult> {
    if (!this.openai) {
      throw new Error("OpenAI not initialized. Please provide an API key.");
    }
    if (!text || text.trim().length === 0) {
      throw new Error("Text content is required for analysis.");
    }

    const prompt = `
Analyze the following customer message and respond in strict JSON format with the following fields:
- sentiment: "positive", "neutral", or "negative" (choose only one)
- intent: a short phrase describing the main intent, e.g. "billing inquiry"
- keywords: up to 3 important keywords (array of strings, e.g. ["billing", "payment", "account"])
- aiAnalysis: a very short phrase describing the overall customer state or situation, e.g. "customer happy", "customer frustrated", "customer confused"

ONLY return a valid JSON object with these fields and nothing else.

Message:
${text}
`;

    const response = await this.openai.chat.completions.create({
      model: this.config.model!,
      messages: [
        {
          role: "system",
          content:
            "You are an expert customer support assistant. Always respond in strict JSON as instructed.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content || "";
    // Try to parse the JSON from the response
    try {
      // Find the first and last curly braces to extract JSON
      const jsonMatch = content.match(/{[\s\S]*}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      const parsed = JSON.parse(jsonString);

      // Validate fields
      if (
        typeof parsed.sentiment === "string" &&
        (parsed.sentiment === "positive" ||
          parsed.sentiment === "neutral" ||
          parsed.sentiment === "negative") &&
        typeof parsed.intent === "string" &&
        Array.isArray(parsed.keywords) &&
        parsed.keywords.length <= 3 &&
        typeof parsed.aiAnalysis === "string"
      ) {
        return parsed as TextAnalysisResult;
      } else {
        throw new Error("Invalid analysis result format");
      }
    } catch (err) {
      console.error("Failed to parse AI analysis JSON:", content, err);
      throw new Error("Failed to parse AI analysis result");
    }
  }

  /**
   * Update the OpenAI configuration
   */
  updateConfig(newConfig: Partial<OpenAIConfig>) {
    // If apiKey is not provided in newConfig, keep the existing one
    const apiKey =
      newConfig.apiKey ||
      this.config.apiKey ||
      process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "OpenAI API key not found. Please set it in your environment variables (NEXT_PUBLIC_OPENAI_API_KEY or OPENAI_API_KEY) or pass it in the config."
      );
    }

    this.config = { ...this.config, ...newConfig, apiKey };

    this.initializeOpenAI();
  }

  /**
   * Check if OpenAI is properly initialized
   */
  isInitialized(): boolean {
    return this.openai !== null;
  }
}

/**
 * Initialize the OpenAI summary utility singleton
 * If apiKey is not provided, will use env variable.
 */
export function initializeOpenAISummary(
  config: OpenAIConfig = {}
): OpenAISummaryUtil {
  return OpenAISummaryUtil.getInstance(config);
}

/**
 * Get the current instance of the OpenAI summary utility singleton
 */
export function getOpenAISummaryUtil(): OpenAISummaryUtil {
  return OpenAISummaryUtil.getInstance();
}

/**
 * Convenience function to generate a summary
 */
export async function generateSummary(
  text: string,
  options: SummaryOptions = {}
): Promise<SummaryResult> {
  const util = getOpenAISummaryUtil();
  return util.generateSummary(text, options);
}

/**
 * Generate a very short summary (1-2 lines, max 50-60 characters)
 */
export async function generateShortSummary(
  text: string,
  maxChars: number = 60
): Promise<string> {
  const util = getOpenAISummaryUtil();

  if (!text || text.trim().length === 0) {
    throw new Error("Text content is required for summarization.");
  }

  try {
    const prompt = `Create a very brief summary of the following text in exactly ${maxChars} characters or less. Make it concise and capture the main point in 1-2 short sentences. Do not include any other text or comments:

Text: ${text}

Summary:`;

    const response = await util["openai"]!.chat.completions.create({
      model: util["config"].model!,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates extremely concise summaries. Always stay within the character limit.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100,
      temperature: 0.3, // Lower temperature for more consistent, concise output
    });

    const summary = response.choices[0]?.message?.content || "";

    // Ensure the summary doesn't exceed the character limit
    return summary.length > maxChars
      ? summary.substring(0, maxChars).trim()
      : summary.trim();
  } catch (error) {
    console.error("Error generating short summary:", error);
    throw new Error(
      error instanceof Error
        ? `Short summary generation failed: ${error.message}`
        : "Short summary generation failed"
    );
  }
}

/**
 * Analyze sentiment, intent, keywords, and AI analysis for a text.
 */
export async function analyzeText(text: string): Promise<TextAnalysisResult> {
  const util = getOpenAISummaryUtil();
  return util.analyzeText(text);
}

export default OpenAISummaryUtil;
