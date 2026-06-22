import Subject from "../models/Subject.js";
import Chapter from "../models/Chapter.js";

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user._id }).sort(
      "-createdAt"
    );
    res.json({ success: true, data: subjects });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch subjects.",
    });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { name, totalChapters, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required.",
      });
    }

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create subject.",
    });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, totalChapters, color } = req.body;

    const subject = await Subject.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { name, totalChapters, color },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    res.json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update subject.",
    });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    // Also delete all chapters for this subject
    await Chapter.deleteMany({ subjectId: id });

    res.json({
      success: true,
      message: "Subject deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete subject.",
    });
  }
};
