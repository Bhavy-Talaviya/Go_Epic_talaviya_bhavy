const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    instruction: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    // No enum restriction — dataset has raw values like 'beginner', 'intermediate', 'hard'
    difficulty: {
      type: String,
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    output: {
      type: String,
    },
    dataset_source: {
      type: String,
      trim: true,
    },
    problem_number: {
      type: Number,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "dataset", // Read directly from the 'dataset' MongoDB collection
  }
);

// Virtual: normalize difficulty for frontend display
problemSchema.virtual("normalizedDifficulty").get(function () {
  const d = (this.difficulty || "").toLowerCase();
  if (d === "easy" || d === "beginner") return "easy";
  if (d === "medium" || d === "intermediate") return "medium";
  if (d === "advanced" || d === "hard" || d === "difficult") return "advanced";
  return "medium";
});

// Virtual: title derived from instruction
problemSchema.virtual("title").get(function () {
  const instr = this.instruction || "";
  return instr.length > 60 ? instr.substring(0, 60) + "..." : instr;
});

problemSchema.set("toJSON", { virtuals: true });
problemSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Problem", problemSchema);