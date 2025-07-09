import {
  initializeOpenAISummary,
  generateSummary,
  generateShortSummary,
  SummaryOptions,
} from "./openai.util";

// Example usage of the OpenAI Summary Utility

/**
 * Example 1: Basic initialization and usage
 */
export async function basicSummaryExample() {
  // Initialize the utility with your OpenAI API key
  initializeOpenAISummary({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "your-api-key-here",
    model: "gpt-3.5-turbo",
    maxTokens: 500,
    temperature: 0.7,
  });

  const sampleText = `
    Artificial Intelligence (AI) has become one of the most transformative technologies of the 21st century. 
    From machine learning algorithms that power recommendation systems to natural language processing that 
    enables chatbots and virtual assistants, AI is reshaping how we interact with technology. 
    
    The field encompasses various sub-disciplines including computer vision, robotics, and deep learning. 
    Companies across industries are investing heavily in AI research and development, recognizing its 
    potential to drive innovation and competitive advantage. However, the rapid advancement of AI also 
    raises important questions about ethics, privacy, and the future of work.
  `;

  try {
    // Generate a basic summary
    const result = await generateSummary(sampleText);
    console.log("Basic Summary:", result.summary);
    console.log("Word Count:", result.wordCount);
    console.log("Processing Time:", result.processingTime, "ms");
  } catch (error) {
    console.error("Error generating summary:", error);
  }
}

/**
 * Example 2: Summary with custom options
 */
export async function customSummaryExample() {
  const sampleText = `
    Climate change represents one of the most pressing challenges facing humanity today. 
    The scientific consensus is clear: human activities, particularly the burning of fossil fuels, 
    are driving unprecedented changes in Earth's climate system. These changes manifest in rising 
    global temperatures, melting ice caps, sea level rise, and more frequent extreme weather events.
    
    The impacts of climate change are already being felt worldwide, affecting agriculture, 
    water resources, biodiversity, and human health. Vulnerable communities, particularly in 
    developing nations, are disproportionately affected despite contributing least to the problem.
    
    Addressing climate change requires urgent action at multiple levels: individual, community, 
    national, and international. This includes transitioning to renewable energy sources, 
    improving energy efficiency, protecting and restoring ecosystems, and implementing 
    sustainable practices across all sectors of society.
  `;

  const options: SummaryOptions = {
    maxLength: 100,
    style: "bullet-points",
    language: "English",
    includeKeyPoints: true,
  };

  try {
    const result = await generateSummary(sampleText, options);
    console.log("Custom Summary:", result.summary);
    if (result.keyPoints) {
      console.log("Key Points:", result.keyPoints);
    }
  } catch (error) {
    console.error("Error generating custom summary:", error);
  }
}

/**
 * Example 3: Batch processing multiple texts
 */
export async function batchSummaryExample() {
  const texts = [
    "The Internet of Things (IoT) connects everyday devices to the internet, enabling them to collect and share data.",
    "Blockchain technology provides a decentralized and secure way to record transactions across multiple computers.",
    "Virtual Reality (VR) creates immersive digital environments that users can interact with using specialized equipment.",
  ];

  try {
    const util = initializeOpenAISummary({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "your-api-key-here",
    });

    const results = await util.generateBatchSummaries(texts, {
      style: "concise",
      maxLength: 50,
    });

    results.forEach((result, index) => {
      console.log(`Summary ${index + 1}:`, result.summary);
    });
  } catch (error) {
    console.error("Error in batch processing:", error);
  }
}

/**
 * Example 4: Short summary (1-2 lines, max 50-60 characters)
 */
export async function shortSummaryExample() {
  const sampleTexts = [
    "The customer called to inquire about their recent order status and was concerned about the delivery delay. They mentioned they needed the package by Friday for an important business meeting.",
    "Technical support call regarding login issues. User couldn't access their account and was frustrated after trying multiple password resets.",
    "Sales inquiry about enterprise pricing for the premium software package. Customer is interested in a 100-user license and wants to discuss bulk discounts.",
  ];

  try {
    // Initialize if not already done
    initializeOpenAISummary({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "your-api-key-here",
    });

    for (const text of sampleTexts) {
      const shortSummary = await generateShortSummary(text, 60);
      console.log(`Original: ${text.substring(0, 100)}...`);
      console.log(
        `Short Summary (${shortSummary.length} chars): "${shortSummary}"`
      );
      console.log("---");
    }
  } catch (error) {
    console.error("Error generating short summary:", error);
  }
}

/**
 * Example 5: React component usage
 */
export function useSummaryInReact() {
  // This is an example of how you might use it in a React component
  const generateSummaryForComponent = async (text: string) => {
    try {
      // Make sure to initialize in your app's entry point or context
      if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        throw new Error("OpenAI API key not configured");
      }

      const result = await generateSummary(text, {
        style: "detailed",
        maxLength: 200,
        includeKeyPoints: true,
      });

      return result;
    } catch (error) {
      console.error("Failed to generate summary:", error);
      throw error;
    }
  };

  const generateShortSummaryForComponent = async (text: string) => {
    try {
      if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        throw new Error("OpenAI API key not configured");
      }

      const shortSummary = await generateShortSummary(text, 60);
      return shortSummary;
    } catch (error) {
      console.error("Failed to generate short summary:", error);
      throw error;
    }
  };

  return { generateSummaryForComponent, generateShortSummaryForComponent };
}

// Export all examples
export const examples = {
  basicSummaryExample,
  customSummaryExample,
  batchSummaryExample,
  shortSummaryExample,
  useSummaryInReact,
};
