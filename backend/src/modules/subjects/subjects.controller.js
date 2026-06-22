import Subject from "../../models/Subject.js";
import Chapter from "../../models/Chapter.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";

export const getSubjects = catchAsync(async (req, res) => {
  const subjects = await Subject.find({ userId: req.user._id }).sort("-createdAt");
  res.json({ success: true, data: subjects });
});

export const createSubject = catchAsync(async (req, res) => {
  const { name, totalChapters, color } = req.body;

  if (!name) throw new ApiError(400, "Subject name is required.");

  const subject = await Subject.create({
    userId: req.user._id,
    name,
    totalChapters: totalChapters || 0,
    color: color || "indigo",
  });

  // Auto-create chapters if totalChapters > 0
  if (totalChapters > 0) {
    const chapters = Array.from({ length: totalChapters }, (_, i) => ({
      subjectId: subject._id,
      name: `Chapter ${i + 1}`,
      order: i,
      status: "not-started",
    }));
    await Chapter.insertMany(chapters);
  }

  res.status(201).json({ success: true, data: subject });
});

export const updateSubject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, totalChapters, color } = req.body;

  const subject = await Subject.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { name, totalChapters, color },
    { new: true, runValidators: true }
  );

  if (!subject) throw new ApiError(404, "Subject not found.");

  res.json({ success: true, data: subject });
});

export const deleteSubject = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Soft delete — just set isDeleted flag
  const subject = await Subject.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { isDeleted: true },
    { new: true }
  );

  if (!subject) throw new ApiError(404, "Subject not found.");

  // Soft delete all chapters for this subject too
  await Chapter.updateMany({ subjectId: id }, { isDeleted: true });

  res.json({ success: true, message: "Subject deleted successfully." });
});
