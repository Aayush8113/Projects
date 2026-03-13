const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security & Parsing Middleware
// CRITICAL: Increased limit for Base64 Images
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
  origin: process.env.CLIENT_URL || "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Routes
app.use('/api/chat', chatRoutes);

// Health Check
app.get('/', (req, res) => {
    res.status(200).json({ status: 'active', message: '🟢 Aethel-Nexus Brain is Online' });
});

// Global Error Handler (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/chat`);
});

// Handle unhandled promise rejections (Crash safely)
process.on('unhandledRejection', (err, promise) => {
    console.log(`🔥 Error: ${err.message}`);
    server.close(() => process.exit(1));
});