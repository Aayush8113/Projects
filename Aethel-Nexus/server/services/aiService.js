const { GoogleGenerativeAI } = require("@google/generative-ai");
const AppError = require("../utils/AppError");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("CRITICAL: GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `
You are Aethel-Nexus, an elite Senior Full Stack Architect and AI coding assistant.
- Code: Production-grade, modular, secure.
- Tone: Professional, concise.
- Rules: React Hooks, Tailwind CSS, Async/Await.
- Formatting: Use Markdown.
`;

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", 
  systemInstruction: SYSTEM_INSTRUCTION,
});

exports.generateAIReply = async (history, message, imageBase64) => {
  try {
    let chatHistory = [];
    
    // Only add text history to avoid confusion with images in previous turns
    if (history && Array.isArray(history)) {
      const firstUserIndex = history.findIndex((msg) => msg.role === "user");
      if (firstUserIndex !== -1) {
        chatHistory = history.slice(firstUserIndex).map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }));
      }
    }

    const chatSession = model.startChat({ history: chatHistory });
    
    // HANDLE IMAGE + TEXT
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg", 
        },
      };
      
      const result = await chatSession.sendMessage([message, imagePart]);
      return result.response.text();
    } 
    
    // TEXT ONLY
    const result = await chatSession.sendMessage(message);
    return result.response.text();
    
  } catch (error) {
    console.error("AI Service Error:", error);
    if (error.message.includes("404")) throw new AppError("Model version mismatch or API Key Error.", 503);
    throw new AppError("AI Brain Connection Failed.", 503);
  }
};

exports.generateSmartTitle = async (firstMessage) => {
  try {
    const titleModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await titleModel.generateContent(
      `Summarize this into a short 4-word title (No quotes): "${firstMessage}"`
    );
    return result.response.text().trim();
  } catch (error) {
    console.warn("Title generation failed, using default.");
    return "New Session"; 
  }
};