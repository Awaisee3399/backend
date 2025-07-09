const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "todo", "in-progress", "done", "completed"],
    required: true,
    lowercase: true,
  },
  category: {
    type: String,
    enum: ["high", "low", "medium"],
    required: true,
    lowercase: true,
  },
  color: {
    type: String,
    enum: ["green", "yellow", "red"],
    required: true,
    lowercase: true,
  },
  file: {
    originalName: String,
    fileName: String,
    size: Number,
    path: String,
    mimeType: String,
  },

  dueDate: String,
  comments: [
    {
      text: String,
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    },
  ],
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: "7d" },
  },
},
  {
    timestamps: true,
  }
);

taskSchema.index({ title: "text", description: "text" });
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
