import Chapter from "../models/Chapter.js";
import Subject from "../models/Subject.js";

export const getChaptersBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Verify subject belongs to user
    const subject = await Subject.findOne({
      _id: subjectId,
      userId: req.user._id,
    });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    const chapters = await Chapter.find({ subjectId }).sort("order");

    res.json({ success: true, data: chapters });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch chapters.",
    });
  }
};

export const createChapter = async (req, res) => {
  try {
    const { subjectId, name } = req.body;

    if (!subjectId || !name) {
      return res.status(400).json({
        success: false,
        message: "Subject ID and chapter name are required.",
      });
    }

    // Verify subject belongs to user
    const subject = await Subject.findOne({
      _id: subjectId,
      userId: req.user._id,
    });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create chapter.",
    });
  }
};

export const updateChapterStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["not-started", "learning", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Verify chapter's subject belongs to user
    const chapter = await Chapter.findById(id).populate({
      path: "subjectId",
      match: { userId: req.user._id },
      select: "_id",
    });

    if (!chapter || !chapter.subjectId) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found.",
      });
    }

    chapter.status = status;
    await chapter.save();

    res.json({ success: true, data: chapter });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update chapter status.",
    });
  }
};

export const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify chapter's subject belongs to user
    const chapter = await Chapter.findById(id).populate({
      path: "subjectId",
      match: { userId: req.user._id },
      select: "_id",
    });

    if (!chapter || !chapter.subjectId) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found.",
      });
    }

    await Chapter.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Chapter deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete chapter.",
    });
  }
};
