import * as authService from "../services/authService.js";
import catchAsync from "../utils/catchAsync.js";

const cookieOptions = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

/**
 * Helper to send tokens and user details
 */
const sendTokenResponse = (user, accessToken, refreshToken, statusCode, res) => {
  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.status(statusCode).json({
    success: true,
    data: {
      user,
      accessToken,
    },
  });
};

export const register = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);
  sendTokenResponse(user, accessToken, refreshToken, 201, res);
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
  sendTokenResponse(user, accessToken, refreshToken, 200, res);
});

export const refresh = catchAsync(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  const { user, accessToken, refreshToken } = await authService.refreshUserTokens(incomingRefreshToken);
  sendTokenResponse(user, accessToken, refreshToken, 200, res);
});

export const logout = catchAsync(async (req, res) => {
  // If user is authenticated, clear DB token
  if (req.user) {
    await authService.clearUserRefreshToken(req.user._id);
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
