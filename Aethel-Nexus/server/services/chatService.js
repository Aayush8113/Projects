const Chat = require("../models/Chat");
const aiService = require("./aiService");
const AppError = require("../utils/AppError");

exports.processChat = async (chatId, message, history, image) => {
  if (!message && !image) throw new AppError("Content required", 400);

  // 1. Get AI Response
  const aiResponseText = await aiService.generateAIReply(history, message || "Analyze this image", image);

  let chatDoc;
  let isNewChat = false;

  if (chatId) chatDoc = await Chat.findById(chatId);

  // Save tag for image to keep DB clean
  const userContent = image ? `${message} [Image Uploaded]` : message;

  if (chatDoc) {
    chatDoc.messages.push({ role: "user", content: userContent });
    chatDoc.messages.push({ role: "model", content: aiResponseText });
    await chatDoc.save();
  } else {
    isNewChat = true;
    // Safe title generation
    const smartTitle = await aiService.generateSmartTitle(message || "Image Analysis");

    chatDoc = await Chat.create({
      title: smartTitle, 
      messages: [
        { role: "user", content: userContent },
        { role: "model", content: aiResponseText },
      ],
    });
  }

  return { 
    reply: aiResponseText, 
    chatId: chatDoc._id,
    title: chatDoc.title,
    isNewChat
  };
};

exports.deleteAllChats = async () => { await Chat.deleteMany({}); };
exports.findAllChats = async () => { return await Chat.find().sort({ updatedAt: -1 }).select("title createdAt updatedAt"); };
exports.findChatById = async (id) => { return await Chat.findById(id); };