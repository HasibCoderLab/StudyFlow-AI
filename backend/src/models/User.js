import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    classLevel: {
      type: String,
      default: "",
    },
    goal: {
      type: String,
      default: "",
    },
    subjects: {
      type: [String],
      default: [],
    },
    examDate: {
      type: Date,
      default: null,
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
    // AI chat daily rate limit
    dailyAiMessages: {
      type: Number,
      default: 0,
    },
    lastAiMessageDate: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

// ── Indexes ──
// NOTE: email is already indexed via unique:true in the schema definition
userSchema.index({ plan: 1 });

// ── Pre-save: hash password ──
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Strip sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

export default mongoose.model("User", userSchema);
