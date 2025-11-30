import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

export async function GET(_, { params }) {
  await connectDB();
  const task = await Task.findById(params.id)
    .populate("assignees")
    .populate("columnId")
    .populate("projectId");

  return Response.json(task);
}

export async function PUT(req, { params }) {
  await connectDB();
  const data = await req.json();
  const task = await Task.findByIdAndUpdate(params.id, data, { new: true });
  return Response.json(task);
}

export async function DELETE(_, { params }) {
  await connectDB();
  await Task.findByIdAndDelete(params.id);
  return Response.json({ message: "Task deleted" });
}
