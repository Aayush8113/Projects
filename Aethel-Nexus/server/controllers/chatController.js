const chatService = require("../services/chatService");
const asyncHandler = require("../middleware/asyncHandler");

exports.generateResponse = asyncHandler(async (req, res, next) => {
  const { message, history, chatId, image } = req.body;
  const result = await chatService.processChat(chatId, message, history, image);
  res.status(200).json({ success: true, ...result });
});

exports.getAllChats = asyncHandler(async (req, res, next) => {
  const chats = await chatService.findAllChats();
  res.status(200).json({ success: true, count: chats.length, data: chats });
});

exports.getSingleChat = asyncHandler(async (req, res, next) => {
  const chat = await chatService.findChatById(req.params.id);
  res.status(200).json({ success: true, data: chat });
});

exports.clearHistory = asyncHandler(async (req, res, next) => {
  await chatService.deleteAllChats();
  res.status(200).json({ success: true, message: "History cleared successfully" });
});