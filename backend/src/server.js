import env from "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
import ApiError from "./utils/ApiError.js";

// ── Module Routes ──
import authRoutes from "./modules/auth/auth.route.js";
import userRoutes from "./modules/users/users.route.js";
import subjectRoutes from "./modules/subjects/subjects.route.js";
import chapterRoutes from "./modules/chapters/chapters.route.js";
import studyPlanRoutes from "./modules/studyPlan/studyPlan.route.js";
import quizRoutes from "./modules/quiz/quiz.route.js";
import studyLogRoutes from "./modules/studyLogs/studyLogs.route.js";
import dashboardRoutes from "./modules/dashboard/dashboard.route.js";
import aiChatRoutes from "./modules/aiChat/aiChat.route.js";

const app = express();
const PORT = env.PORT;

// ── Security Middleware ──
app.use(helmet());           // Set security HTTP headers
app.use(mongoSanitize());    // Prevent NoSQL query injection

// ── CORS ──
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" })); // Body parser with payload limit
app.use(cookieParser());

// ── Global Rate Limiter ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// ── Request Logger ──
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// ── API v1 Routes ──
const V1 = "/api/v1";

app.use(`${V1}/auth`, authRoutes);
app.use(`${V1}/users`, userRoutes);
app.use(`${V1}/subjects`, subjectRoutes);
app.use(`${V1}/chapters`, chapterRoutes);
app.use(`${V1}/study-plan`, studyPlanRoutes);
app.use(`${V1}/quiz`, quizRoutes);
app.use(`${V1}/study-logs`, studyLogRoutes);
app.use(`${V1}/dashboard`, dashboardRoutes);
app.use(`${V1}/ai-chat`, aiChatRoutes);

// ── Health Check ──
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    version: "v1",
    message: "StudyFlow AI API is running.",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ──
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error.";

  logger.error(
    `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`
  );

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ── Graceful Shutdown ──
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

// ── Start Server ──
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(
      `🚀 Server running in ${env.NODE_ENV} mode on http://localhost:${PORT}`
    );
    logger.info(`📡 API base path: http://localhost:${PORT}/api/v1`);
  });
});
