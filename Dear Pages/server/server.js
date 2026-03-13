const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
require("colors");

const connectDB = require("./config/db");
const { errorHandler } = require("./utils/errorMiddleware");
const startCronJobs = require("./utils/cronJobs"); 

dotenv.config();
connectDB();
const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 150, 
  message: { success: false, message: "Too many requests." },
});
app.use("/api", limiter);

app.use(cors({ origin: ["http://localhost:5173", process.env.CLIENT_URL], credentials: true }));
app.use(express.json({ limit: "10kb" })); 
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/books", require("./routes/bookRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: `API Endpoint ${req.originalUrl} not found` });
});

startCronJobs();
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n📖 DEARPAGES SERVER ONLINE`.cyan.bold);
  console.log(`🛡️  Env: ${process.env.NODE_ENV} | Port: ${PORT}`.white);
});

process.on("unhandledRejection", (err) => {
  console.log(`❌ DB Connection Error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});