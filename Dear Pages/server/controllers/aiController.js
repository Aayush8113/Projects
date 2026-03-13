const { GoogleGenerativeAI } = require("@google/generative-ai");
const Book = require('../models/Book');

// 🚀 UPGRADED: Using the latest model your API key supports
const MODEL_NAME = "gemini-2.0-flash"; 

const getAIModel = () => {
  if (!process.env.GEMINI_KEY) {
    throw new Error("SERVER ERROR: Missing GEMINI_KEY in .env");
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  return genAI.getGenerativeModel({ model: MODEL_NAME });
};

// 🛡️ INDESTRUCTIBLE JSON EXTRACTOR
// Gemini sometimes wraps JSON in markdown (```json ... ```). This prevents crashes.
const extractStrictJSON = (text) => {
  try {
    let cleanText = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const start = cleanText.indexOf('{');
    const end = cleanText.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    return JSON.parse(cleanText.substring(start, end + 1));
  } catch (err) {
    console.error("JSON Parse Error:", err.message);
    return null;
  }
};

// ==========================================
// 1. VAULT AI CHATBOT (Synced with your personal shelf)
// ==========================================
exports.getAiChatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    const model = getAIModel();
    
    // 🔐 AUTOMATIC VAULT LOGIN: 
    // This securely fetches ONLY the logged-in user's books right now in real-time.
    const userShelf = await Book.find({ owner: req.user.id }).lean();
    
    const shelfContext = userShelf.map(b => 
      `- "${b.title}" by ${b.author} (Genre: ${b.category}, Current Status: ${b.status})`
    ).join("\n");

    const prompt = `
      You are the Master Librarian of my private "DearPages" family vault.
      
      HERE IS MY ACTUAL, REAL-TIME DATABASE SHELF RIGHT NOW:
      ${shelfContext || "The shelf is currently empty."}
      
      USER'S MESSAGE: "${message}"
      
      YOUR DIRECTIVES:
      1. You are talking directly to the vault owner.
      2. If I ask what I should read next, ONLY suggest books from my shelf that have the status "Next Up" or "All Books".
      3. If I want a completely new recommendation not on my shelf, suggest one real, highly-acclaimed book that fits my existing tastes.
      4. If asked about a book I own, provide deep emotional themes.
      5. Keep your response conversational, formatting book titles in **bold**.
    `;
    
    const result = await model.generateContent(prompt);
    res.json({ success: true, reply: result.response.text() });
  } catch (err) {
    console.error("🔥 Chat Error:", err.message);
    res.status(500).json({ success: false, reply: "The AI archives are resting. Please try again." });
  }
};

// ==========================================
// 2. REAL-TIME TREND ANALYST
// ==========================================
exports.getAiSuggestion = async (req, res) => {
  try {
    const model = getAIModel();
    
    // 🕰️ REAL-TIME INJECTION: Force the AI to know exactly what day it is today
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const prompt = `
      Act as a Global Literary Trend Analyst. Today's exact date is ${today}.
      
      TASK: Suggest ONE highly acclaimed, real book that is trending worldwide RIGHT NOW.
      - DO NOT suggest outdated classics (like 1984, The Alchemist, or Harry Potter).
      - Look for recent award winners, modern bestsellers, or viral hits.
      - Give me something fresh.
      
      RETURN STRICTLY VALID JSON ONLY:
      {"title": "Exact Book Title", "author": "Exact Author Name"}
    `;
    
    const result = await model.generateContent(prompt);
    const recommendation = extractStrictJSON(result.response.text());

    if (!recommendation || !recommendation.title) throw new Error("Invalid JSON from AI");
    
    res.json({ success: true, recommendation });
  } catch (err) {
    console.error("🔥 Trend Error:", err.message);
    // Fallback so the frontend never breaks if Google's API crashes
    res.json({ success: true, recommendation: { title: "The Women", author: "Kristin Hannah" } });
  }
};

// ==========================================
// 3. SMART AUTO-FILL (Metadata Analyzer)
// ==========================================
exports.analyzeBookMetadata = async (req, res) => {
  const { title, author } = req.body;
  if (!title) return res.status(400).json({ success: false, message: "Title required" });

  try {
    const model = getAIModel();
    const prompt = `
      Act as a strict Literary Data Validator.
      User Input: Title "${title}", Author "${author || 'Unknown'}".
      
      Tasks: 
      1. Fix any spelling errors in the title or author name.
      2. Assign a specific, accurate genre.
      3. Generate a 15-word emotional core concept/summary.
      
      RETURN STRICTLY VALID JSON ONLY:
      { 
        "valid": true, 
        "fixedTitle": "Correct Title", 
        "fixedAuthor": "Correct Author", 
        "category": "Specific Genre", 
        "coreConcept": "15-word emotional insight..." 
      }
    `;

    const result = await model.generateContent(prompt);
    const data = extractStrictJSON(result.response.text());

    if (!data || data.valid === false) {
      return res.status(404).json({ success: false, message: "Book not found." });
    }

    res.json({ 
      success: true, 
      data: { 
        title: data.fixedTitle || title, 
        author: data.fixedAuthor || author, 
        category: data.category || "General", 
        coreConcept: data.coreConcept || "" 
      }
    });
  } catch (err) {
    console.error("🔥 Analyze Error:", err.message);
    res.status(500).json({ success: false, message: "AI Connection Failed." });
  }
};