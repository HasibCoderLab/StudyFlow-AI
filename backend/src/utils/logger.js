import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

// Custom format
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Transports configuration
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: path.join(__dirname, "..", "logs", "error.log"),
    level: "error",
  }),
  new winston.transports.File({
    filename: path.join(__dirname, "..", "logs", "combined.log"),
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels: winston.config.npm.levels,
  format,
  transports,
});

export default logger;
