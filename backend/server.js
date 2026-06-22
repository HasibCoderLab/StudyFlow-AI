// ENV is loaded via --env-file=.env flag (Node.js v20.6+)
import { z } from "zod";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import winston from "winston";

// ── Module Routes ──
import authRoutes from "./src/modules/auth/auth.route.js";
import userRoutes from "./src/modules/users/users.route.js";
import subjectRoutes from "./src/modules/subjects/subjects.route.js";
import chapterRoutes from "./src/modules/chapters/chapters.route.js";
import studyPlanRoutes from "./src/modules/studyPlan/studyPlan.route.js";
import quizRoutes from "./src/modules/quiz/quiz.route.js";
import studyLogRoutes from "./src/modules/studyLogs/studyLogs.route.js";
import dashboardRoutes from "./src/modules/dashboard/dashboard.route.js";
import aiChatRoutes from "./src/modules/aiChat/aiChat.route.js";

// ── Env Validation ──
const envSchema = z.object({
  PORT: z
    .string()
    .transform((v) => parseInt(v, 10))
    .default("5000"),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(8),
  JWT_ACCESS_SECRET: z.string().min(8),
  JWT_REFRESH_SECRET: z.string().min(8),
  GEMINI_API_KEY: z.string().min(1),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    "❌ Invalid environment config:",
    JSON.stringify(parsed.error.format(), null, 2)
  );
  process.exit(1);
}
const env = parsed.data;

// ── Logger ──
const logger = winston.createLogger({
  level: env.NODE_ENV === "development" ? "debug" : "warn",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

// ── App ──
const app = express();

// ── Security ──
app.use(helmet());
app.use(mongoSanitize());
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
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// ── Global Rate Limit ──
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests, please try again later.",
  })
);

// ── Request Logger ──
app.use((req, _res, next) => {
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
app.get(`${V1}/health`, (_req, res) => {
  res.json({
    success: true,
    version: "v1",
    message: "StudyFlow AI is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 ──
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// ── Global Error Handler ──
app.use((err, req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";
  logger.error(`${status} - ${message} - ${req.originalUrl}`);
  res.status(status).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ── Process Safety ──
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

// ── Connect DB & Start Server ──
mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    logger.info("✅ MongoDB connected");
    app.listen(env.PORT, () => {
      logger.info(
        `🚀 Server [${env.NODE_ENV}] → http://localhost:${env.PORT}`
      );
      logger.info(
        `📡 API v1  → http://localhost:${env.PORT}/api/v1`
      );
    });
  })
  .catch((err) => {
    logger.error(`DB connection failed: ${err.message}`);
    process.exit(1);
  });
