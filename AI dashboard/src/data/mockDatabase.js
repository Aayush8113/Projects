// src/data/mockDatabase.js

// Simulates 90 days of AI agent activity for the GitHub-style heatmap
export const generateActivityData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Randomize activity levels (0 to 4, mimicking GitHub's contribution grid)
    // Weekends (0 and 6) generally have lower automated activity
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const maxLevel = isWeekend ? 2 : 4;
    const level = Math.floor(Math.random() * (maxLevel + 1));
    
    // Simulate token usage based on the intensity level
    const tokens = level === 0 ? 0 : Math.floor(Math.random() * 50000) * level;

    data.push({
      date: date.toISOString().split('T')[0],
      level,
      tokens
    });
  }
  return data;
};

// Mock LLM & Vision Models replacing standard CRM client data
export const activeModels = [
  { 
    id: 'm1', 
    name: 'Llama-3-Instruct', 
    type: 'LLM', 
    status: 'Deployed', 
    latency: '120ms', 
    costPer1k: 0.002,
    uptime: '99.9%'
  },
  { 
    id: 'm2', 
    name: 'Vision-Net-v2', 
    type: 'Computer Vision', 
    status: 'Training', 
    latency: '--', 
    costPer1k: 0.0,
    uptime: '--'
  },
  { 
    id: 'm3', 
    name: 'Whisper-Audio-Large', 
    type: 'Speech-to-Text', 
    status: 'Idle', 
    latency: '450ms', 
    costPer1k: 0.006,
    uptime: '100%'
  },
  { 
    id: 'm4', 
    name: 'Embeddings-Core', 
    type: 'Vectorization', 
    status: 'Deployed', 
    latency: '45ms', 
    costPer1k: 0.0001,
    uptime: '99.99%'
  },
];