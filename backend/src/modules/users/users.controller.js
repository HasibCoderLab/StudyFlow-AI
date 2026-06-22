import User from "../../models/User.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";

export const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found.");

  res.json({ success: true, data: user });
});

export const updateProfile = catchAsync(async (req, res) => {
  const allowedFields = ["name", "classLevel", "goal", "subjects", "examDate"];

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new ApiError(404, "User not found.");

  res.json({
    success: true,
    data: user,
    message: "Profile updated successfully.",
  });
});
