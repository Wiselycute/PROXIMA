import mongoose from "mongoose";

const ColumnSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  title: { type: String, required: true }, // "To Do", "In Progress", "Done"
  order: { type: Number, default: 0 },    // ordering columns
}, { timestamps: true });

export default mongoose.models.Column || mongoose.model("Column", ColumnSchema);
