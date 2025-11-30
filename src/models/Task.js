import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  columnId: { type: mongoose.Schema.Types.ObjectId, ref: "Column", required: true },

  title: { type: String, required: true },
  description: String,

  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  priority: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "medium" 
  },

  dueDate: Date,
  order: { type: Number, default: 0 }, // sorting inside a column
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
