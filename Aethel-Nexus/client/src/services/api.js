import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: { 'Content-Type': 'application/json' },
});

export const sendMessageToAI = async (message, history, chatId, image) => {
  try {
    // 🆕 Send 'image' in the payload
    const response = await API.post('/chat', { message, history, chatId, image });
    return response.data;
  } catch (error) { throw error; }
};

export const fetchAllChats = async () => {
  try {
    const response = await API.get('/chat');
    return response.data.data;
  } catch (error) { return []; }
};

export const fetchChatById = async (id) => {
  try {
    const response = await API.get(`/chat/${id}`);
    return response.data.data;
  } catch (error) { return null; }
};

export const clearChatHistory = async () => {
  try {
    const response = await API.delete('/chat');
    return response.data;
  } catch (error) { throw error; }
};

export default API;