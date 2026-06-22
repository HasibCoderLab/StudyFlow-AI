import Chapter from "../../models/Chapter.js";
import Subject from "../../models/Subject.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";

export const getChaptersBySubject = catchAsync(async (req, res) => {
  const { subjectId } = req.params;

  // Verify subject belongs to user
  const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
  if (!subject) throw new ApiError(404, "Subject not found.");

  const chapters = await Chapter.find({ subjectId }).sort("order");

  res.json({ success: true, data: chapters });
});

export const createChapter = catchAsync(async (req, res) => {
  const { subjectId, name } = req.body;

  if (!subjectId || !name) {
    throw new ApiError(400, "Subject ID and chapter name are required.");
  }

  // Verify subject belongs to user
  const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
  if (!subject) throw new ApiError(404, "Subject not found.");

  // Get the highest order for this subject
  const lastChapter = await Chapter.findOne({ subjectId })
    .sort("-order")
    .select("order");

  const chapter = await Chapter.create({
    subjectId,
    name,
    order: (lastChapter?.order ?? -1) + 1,
  });

  res.status(201).json({ success: true, data: chapter });
});

export const updateChapterStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["not-started", "learning", "completed"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  // Verify chapter's subject belongs to user
  const chapter = await Chapter.findById(id).populate({
    path: "subjectId",
    match: { userId: req.user._id },
    select: "_id",
  });

  if (!chapter || !chapter.subjectId) throw new ApiError(404, "Chapter not found.");

  chapter.status = status;
  await chapter.save();

  res.json({ success: true, data: chapter });
});

export const deleteChapter = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Verify chapter's subject belongs to user
  const chapter = await Chapter.findById(id).populate({
    path: "subjectId",
    match: { userId: req.user._id },
    select: "_id",
  });

  if (!chapter || !chapter.subjectId) throw new ApiError(404, "Chapter not found.");

  // Soft delete
  chapter.isDeleted = true;
  await chapter.save();

  res.json({ success: true, message: "Chapter deleted successfully." });
});
