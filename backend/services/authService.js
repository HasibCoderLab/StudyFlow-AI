import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Subject from "../models/Subject.js";
import Chapter from "../models/Chapter.js";
import StudyPlan from "../models/StudyPlan.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import { generateDummyPlan } from "../controllers/studyPlanController.js";

/**
 * Generate Access and Refresh tokens
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

/**
 * Register a new user with subjects, chapters, and dummy study plan
 */
export const registerUser = async (userData) => {
  const { name, email, password, classLevel, goal, subjects, examDate } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(400, "A user with this email already exists.");
  }

  // Use a transaction session if possible
  const session = await mongoose.startSession();
  let transactionActive = false;

  try {
    // Attempt to start a transaction
    try {
      session.startTransaction();
      transactionActive = true;
    } catch (sessionErr) {
      logger.warn("Transactions are not supported by the database. Falling back to non-transactional execution.");
    }

    // Create user
    const [user] = await User.create(
      [
        {
          name,
          email,
          password,
          classLevel: classLevel || "",
          goal: goal || "",
          subjects: subjects || [],
          examDate: examDate || null,
        },
      ],
      { session }
    );

    // Create subjects and chapters if provided
    if (Array.isArray(subjects) && subjects.length > 0) {
      for (const subjName of subjects) {
        const [subject] = await Subject.create(
          [
            {
              userId: user._id,
              name: subjName,
              totalChapters: 5,
              color: ["indigo", "purple", "pink", "blue", "emerald"][
                Math.floor(Math.random() * 5)
              ],
            },
          ],
          { session }
        );

        const chapters = Array.from({ length: 5 }, (_, i) => ({
          subjectId: subject._id,
          name: `Chapter ${i + 1}`,
          order: i,
          status: "not-started",
        }));
        
        await Chapter.insertMany(chapters, { session });
      }
    }

    // Create study plan if examDate is provided
    if (examDate && Array.isArray(subjects) && subjects.length > 0) {
      const dummyPlan = generateDummyPlan({
        examDate,
        subjects,
        dailyHours: 4,
      });

      await StudyPlan.create(
        [
          {
            userId: user._id,
            examDate: new Date(examDate),
            dailyHours: 4,
            days: dummyPlan.days,
          },
        ],
        { session }
      );
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save({ session, validateBeforeSave: false });

    if (transactionActive) {
      await session.commitTransaction();
    }
    session.endSession();

    // Re-fetch user without password for response
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;

    return { user: userObject, accessToken, refreshToken };
  } catch (error) {
    if (transactionActive) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};

/**
 * Authenticate user and return user info with tokens
 */
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.refreshToken;

  return { user: userObject, accessToken, refreshToken };
};

/**
 * Refresh tokens using valid refresh token
 */
export const refreshUserTokens = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is missing.");
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user with refresh token
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token.");
    }

    // Generate new token pair (refresh token rotation)
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    // Update refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const userObject = user.toObject();
    delete userObject.refreshToken;

    return { user: userObject, accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      throw new ApiError(401, "Invalid or expired refresh token.");
    }
    throw error;
  }
};

/**
 * Revoke refresh token on logout
 */
export const clearUserRefreshToken = async (userId) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
};
